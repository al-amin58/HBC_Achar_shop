import mongoose from "mongoose";
import ProductVariation from "../../models/ProductVariation.js";

const normalizeCombination = (body) => {
  const raw = body.attributes || body.combination;
  if (!Array.isArray(raw)) return [];
  return raw.map((a) => ({
    attributeId: a.attrId || a.attributeId,
    attributeName: String(a.attrName || a.attributeName || "").trim(),
    value: String(a.value || "").trim(),
  }));
};

const variationFromBody = (body) => {
  const combination = normalizeCombination(body);
  return {
    sku: String(body.sku || "").trim(),
    combination,
    price: body.price != null && body.price !== "" ? String(body.price) : "",
    discountPrice:
      body.discountPrice != null && body.discountPrice !== "" ? String(body.discountPrice) : "",
    stock: body.stock != null && body.stock !== "" ? String(body.stock) : "",
    flashSale: Boolean(body.flashSale),
    cashback: body.cashback != null && body.cashback !== "" ? String(body.cashback) : "",
    image: body.image != null ? body.image : null,
  };
};

const validateCombination = (combination, res) => {
  if (!combination.length) {
    res.status(400).json({ message: "Variation combination is required." });
    return false;
  }
  for (const c of combination) {
    if (!mongoose.Types.ObjectId.isValid(c.attributeId)) {
      res.status(400).json({ message: "Invalid attribute id in combination." });
      return false;
    }
    if (!c.attributeName || !c.value) {
      res.status(400).json({ message: "Each combination entry needs attributeName and value." });
      return false;
    }
  }
  return true;
};

export const formatVariation = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    _id: o._id,
    sku: o.sku,
    combination: o.combination,
    price: o.price ?? "",
    discountPrice: o.discountPrice ?? "",
    stock: o.stock ?? "",
    flashSale: !!o.flashSale,
    cashback: o.cashback ?? "",
    image: o.image ?? null,
  };
};

export const getProductVariations = async (_req, res) => {
  try {
    const list = await ProductVariation.find().sort({ createdAt: 1 });
    return res.status(200).json(list.map(formatVariation));
  } catch {
    return res.status(500).json({ message: "Failed to fetch variations." });
  }
};

export const createProductVariation = async (req, res) => {
  try {
    const payload = variationFromBody(req.body);
    if (!payload.sku) {
      return res.status(400).json({ message: "SKU is required." });
    }
    if (!validateCombination(payload.combination, res)) return;

    const variation = await ProductVariation.create(payload);
    return res.status(201).json({
      message: "Variation created successfully.",
      variation: formatVariation(variation),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A variation with this SKU already exists." });
    }
    return res.status(500).json({ message: "Failed to create variation." });
  }
};

export const updateProductVariation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid variation id." });
    }

    const existing = await ProductVariation.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Variation not found." });
    }

    const hasNewCombination = Array.isArray(req.body.attributes) || Array.isArray(req.body.combination);
    const fallbackCombination = existing.combination.map((c) => ({
      attributeId: c.attributeId,
      attributeName: c.attributeName,
      value: c.value,
    }));

    const merged = {
      sku: req.body.sku !== undefined ? req.body.sku : existing.sku,
      combination: hasNewCombination ? normalizeCombination(req.body) : fallbackCombination,
      price: req.body.price !== undefined ? req.body.price : existing.price,
      discountPrice:
        req.body.discountPrice !== undefined ? req.body.discountPrice : existing.discountPrice,
      stock: req.body.stock !== undefined ? req.body.stock : existing.stock,
      flashSale:
        req.body.flashSale !== undefined ? req.body.flashSale : existing.flashSale,
      cashback: req.body.cashback !== undefined ? req.body.cashback : existing.cashback,
      image: req.body.image !== undefined ? req.body.image : existing.image,
    };

    const payload = variationFromBody(merged);
    if (!payload.sku) {
      return res.status(400).json({ message: "SKU is required." });
    }
    if (!validateCombination(payload.combination, res)) return;

    existing.sku = payload.sku;
    existing.combination = payload.combination;
    existing.price = payload.price;
    existing.discountPrice = payload.discountPrice;
    existing.stock = payload.stock;
    existing.flashSale = payload.flashSale;
    existing.cashback = payload.cashback;
    existing.image = payload.image;

    await existing.save();

    return res.status(200).json({
      message: "Variation updated successfully.",
      variation: formatVariation(existing),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "A variation with this SKU already exists." });
    }
    return res.status(500).json({ message: "Failed to update variation." });
  }
};

export const deleteProductVariation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid variation id." });
    }

    const deleted = await ProductVariation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Variation not found." });
    }

    return res.status(200).json({ message: "Variation deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Failed to delete variation." });
  }
};

export const replaceAllProductVariations = async (req, res) => {
  try {
    const { variations } = req.body;
    if (!Array.isArray(variations)) {
      return res.status(400).json({ message: "Body must include a variations array." });
    }

    const docs = [];
    for (const item of variations) {
      const payload = variationFromBody(item);
      if (!payload.sku) {
        return res.status(400).json({ message: "Each variation must have a SKU." });
      }
      if (!validateCombination(payload.combination, res)) return;
      docs.push(payload);
    }

    await ProductVariation.deleteMany({});
    const created =
      docs.length === 0 ? [] : await ProductVariation.insertMany(docs);

    return res.status(200).json({
      message: "Variations replaced successfully.",
      variations: created.map(formatVariation),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate SKU in batch." });
    }
    return res.status(500).json({ message: "Failed to replace variations." });
  }
};
