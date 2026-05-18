import mongoose from "mongoose";
import Coupon from "../../models/Coupon.js";

const normalizeCode = (code = "") => String(code).trim().toUpperCase();

const isExpired = (coupon) => {
  if (!coupon?.endDate) return false;
  return new Date(coupon.endDate) < new Date();
};

const isNotStarted = (coupon) => {
  if (!coupon?.startDate) return false;
  return new Date(coupon.startDate) > new Date();
};

export const evaluateCoupon = (coupon, subtotal = 0) => {
  if (!coupon) return { valid: false, message: "Coupon not found." };
  if (coupon.status !== "active") {
    return { valid: false, message: "This coupon is not active." };
  }
  if (isNotStarted(coupon)) {
    return { valid: false, message: "This coupon is not valid yet." };
  }
  if (isExpired(coupon)) {
    return { valid: false, message: "This coupon has expired." };
  }
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit." };
  }
  const minOrder = Number(coupon.minOrderAmount) || 0;
  const amount = Number(subtotal) || 0;
  if (amount < minOrder) {
    return {
      valid: false,
      message: `Minimum order amount is ৳${minOrder}.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (amount * Number(coupon.value)) / 100;
    if (coupon.maxDiscount != null) {
      discount = Math.min(discount, Number(coupon.maxDiscount));
    }
  } else {
    discount = Number(coupon.value);
  }
  discount = Math.min(discount, amount);

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount,
      description: coupon.description,
    },
    discount: Math.round(discount * 100) / 100,
  };
};

const formatCoupon = (coupon) => ({
  ...coupon.toObject(),
  isExpired: isExpired(coupon),
  isScheduled: isNotStarted(coupon),
});

const parseOptionalNumber = (val) => {
  if (val == null || val === "") return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
};

const parseOptionalDate = (val) => {
  if (val == null || val === "") return undefined;
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? null : d;
};

const buildCouponDoc = (body) => {
  const {
    code,
    description = "",
    type,
    value,
    maxDiscount,
    minOrderAmount = 0,
    usageLimit,
    startDate,
    endDate,
    status = "active",
  } = body;

  const normalized = normalizeCode(code);
  if (!normalized) {
    return { error: "Coupon code is required." };
  }
  if (!["percentage", "fixed"].includes(type)) {
    return { error: "Invalid discount type." };
  }
  if (value == null || value === "" || Number(value) < 0) {
    return { error: "Valid discount value is required." };
  }
  if (type === "percentage" && Number(value) > 100) {
    return { error: "Percentage cannot exceed 100." };
  }

  const parsedStart = parseOptionalDate(startDate);
  const parsedEnd = parseOptionalDate(endDate);
  if (startDate && parsedStart === null) {
    return { error: "Invalid start date." };
  }
  if (endDate && parsedEnd === null) {
    return { error: "Invalid end date." };
  }

  const doc = {
    code: normalized,
    description: String(description || "").trim(),
    type,
    value: Number(value),
    minOrderAmount: Number(minOrderAmount) || 0,
    status: status === "inactive" ? "inactive" : "active",
  };

  const maxDisc = parseOptionalNumber(maxDiscount);
  if (maxDisc !== undefined) doc.maxDiscount = maxDisc;

  const limit = parseOptionalNumber(usageLimit);
  if (limit !== undefined) doc.usageLimit = limit;

  if (parsedStart) doc.startDate = parsedStart;
  if (parsedEnd) doc.endDate = parsedEnd;

  return { doc };
};

const sendControllerError = (res, error, fallback) => {
  console.error(fallback, error);
  if (error?.code === 11000) {
    return res.status(400).json({ message: "Coupon code already exists." });
  }
  if (error?.name === "ValidationError") {
    const message = Object.values(error.errors || {})
      .map((e) => e.message)
      .join(" ");
    return res.status(400).json({ message: message || fallback });
  }
  return res.status(500).json({ message: error?.message || fallback });
};

export const getCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons.map(formatCoupon));
  } catch {
    return res.status(500).json({ message: "Failed to fetch coupons." });
  }
};

export const getActiveCoupons = async (_req, res) => {
  try {
    const coupons = await Coupon.find({ status: "active" }).sort({ createdAt: -1 });
    const now = new Date();
    const active = coupons.filter((c) => {
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      if (c.usageLimit != null && c.usedCount >= c.usageLimit) return false;
      return true;
    });
    return res.status(200).json(
      active.map((c) => ({
        code: c.code,
        type: c.type,
        value: c.value,
        maxDiscount: c.maxDiscount,
        description: c.description,
      }))
    );
  } catch {
    return res.status(500).json({ message: "Failed to fetch active coupons." });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const code = normalizeCode(req.body?.code || req.query?.code);
    const subtotal = Number(req.body?.subtotal ?? req.query?.subtotal) || 0;

    if (!code) {
      return res.status(400).json({ valid: false, message: "Coupon code is required." });
    }

    const coupon = await Coupon.findOne({ code });
    const result = evaluateCoupon(coupon, subtotal);

    if (!result.valid) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ valid: false, message: "Failed to validate coupon." });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const built = buildCouponDoc(req.body);
    if (built.error) {
      return res.status(400).json({ message: built.error });
    }

    const existing = await Coupon.findOne({ code: built.doc.code });
    if (existing) {
      return res.status(400).json({ message: "Coupon code already exists." });
    }

    const coupon = await Coupon.create(built.doc);

    return res.status(201).json({
      message: "Coupon created successfully.",
      coupon: formatCoupon(coupon),
    });
  } catch (error) {
    return sendControllerError(res, error, "Failed to create coupon.");
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid coupon id." });
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    const {
      code,
      description,
      type,
      value,
      maxDiscount,
      minOrderAmount,
      usageLimit,
      startDate,
      endDate,
      status,
    } = req.body;

    if (code !== undefined) {
      const normalized = normalizeCode(code);
      if (!normalized) {
        return res.status(400).json({ message: "Coupon code is required." });
      }
      const duplicate = await Coupon.findOne({ code: normalized, _id: { $ne: id } });
      if (duplicate) {
        return res.status(400).json({ message: "Coupon code already exists." });
      }
      coupon.code = normalized;
    }

    if (description !== undefined) coupon.description = String(description).trim();
    if (type !== undefined) {
      if (!["percentage", "fixed"].includes(type)) {
        return res.status(400).json({ message: "Invalid discount type." });
      }
      coupon.type = type;
    }
    if (value !== undefined) {
      if (Number(value) < 0) {
        return res.status(400).json({ message: "Valid discount value is required." });
      }
      if (coupon.type === "percentage" && Number(value) > 100) {
        return res.status(400).json({ message: "Percentage cannot exceed 100." });
      }
      coupon.value = Number(value);
    }
    if (maxDiscount !== undefined) {
      coupon.maxDiscount =
        maxDiscount != null && maxDiscount !== "" ? Number(maxDiscount) : null;
    }
    if (minOrderAmount !== undefined) {
      coupon.minOrderAmount = Number(minOrderAmount) || 0;
    }
    if (usageLimit !== undefined) {
      coupon.usageLimit =
        usageLimit != null && usageLimit !== "" ? Number(usageLimit) : null;
    }
    if (startDate !== undefined) {
      coupon.startDate = startDate ? new Date(startDate) : null;
    }
    if (endDate !== undefined) {
      coupon.endDate = endDate ? new Date(endDate) : null;
    }
    if (status !== undefined) {
      coupon.status = status === "inactive" ? "inactive" : "active";
    }

    await coupon.save();

    return res.status(200).json({
      message: "Coupon updated successfully.",
      coupon: formatCoupon(coupon),
    });
  } catch {
    return res.status(500).json({ message: "Failed to update coupon." });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid coupon id." });
    }

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found." });
    }

    return res.status(200).json({ message: "Coupon deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Failed to delete coupon." });
  }
};

export const incrementCouponUsage = async (code) => {
  const normalized = normalizeCode(code);
  if (!normalized) return;
  await Coupon.findOneAndUpdate({ code: normalized }, { $inc: { usedCount: 1 } });
};
