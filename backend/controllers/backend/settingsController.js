import mongoose from "mongoose";
import Product from "../../models/Product.js";
import Settings from "../../models/Settings.js";

const SETTINGS_KEY = "default";

const toIdArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const out = [];
  for (const x of arr) {
    const raw = x?._id ?? x?.id ?? x;
    if (raw == null) continue;
    const s = String(raw);
    if (!mongoose.Types.ObjectId.isValid(s)) continue;
    if (!out.includes(s)) out.push(s);
  }
  return out;
};

const summarizeProduct = (p) => ({
  id: p._id,
  name: p.name,
  price: p.price ?? null,
  sku: p.sku ?? "",
  image: p.image ?? "",
  soldCount: p.sold ?? 0,
});

const fetchProductSummariesInOrder = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const rows = await Product.find({ _id: { $in: ids } })
    .select("name price sku image sold")
    .lean();
  const map = new Map(rows.map((r) => [String(r._id), r]));
  const ordered = [];
  for (const id of ids) {
    const row = map.get(String(id));
    if (row) ordered.push(summarizeProduct(row));
  }
  return ordered;
};

export const getSettings = async (req, res) => {
  try {
    let doc = await Settings.findOne({ key: SETTINGS_KEY }).lean();
    if (!doc) {
      const created = await Settings.create({ key: SETTINGS_KEY, data: {} });
      doc = created.toObject();
    }

    const featuredProducts = await fetchProductSummariesInOrder(doc.featuredProducts || []);
    const newArrivals = await fetchProductSummariesInOrder(doc.newArrivals || []);
    const bestSelling = await fetchProductSummariesInOrder(doc.bestSelling || []);

    return res.json({
      ...(doc.data || {}),
      featuredProducts,
      newArrivals,
      bestSelling,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to load settings." });
  }
};

export const getPublicSettings = async (_req, res) => {
  try {
    let doc = await Settings.findOne({ key: SETTINGS_KEY }).lean();
    if (!doc) {
      const created = await Settings.create({ key: SETTINGS_KEY, data: {} });
      doc = created.toObject();
    }

    const data = doc?.data && typeof doc.data === "object" ? doc.data : {};
    return res.json({
      siteName: data.siteName ?? "",
      siteTitle: data.siteTitle ?? "",
      supportPhone: data.supportPhone ?? "",
      storeAddress: data.storeAddress ?? "",
      logoPreview: data.logoPreview ?? "",
    });
  } catch {
    return res.status(500).json({ message: "Failed to load public settings." });
  }
};

export const upsertSettings = async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const { featuredProducts, newArrivals, bestSelling, ...rest } = body;

    const featuredIds = toIdArray(featuredProducts);
    const newArrivalIds = toIdArray(newArrivals);
    const bestSellingIds = toIdArray(bestSelling);

    // Flash Sale timer: flashTimer (hours) → calculate end timestamp once
    // Only recalculate if flashTimer value changed from what's already stored
    const durationHours = Number(rest.flashSaleDuration ?? rest.flashTimer);
    if (!isNaN(durationHours) && durationHours > 0) {
      // Get existing stored flashSaleEndsAt to check if we need to update
      const existing = await Settings.findOne({ key: SETTINGS_KEY }).lean();
      const existingHours = existing?.data?.flashTimer ?? existing?.data?.flashSaleDuration;
      const timerChanged = String(durationHours) !== String(existingHours);
      if (timerChanged || !existing?.data?.flashSaleEndsAt) {
        rest.flashSaleEndsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
      } else {
        // Keep existing end time so countdown continues correctly
        rest.flashSaleEndsAt = existing.data.flashSaleEndsAt;
      }
    }

    const updated = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      {
        $set: {
          data: rest,
          featuredProducts: featuredIds,
          newArrivals: newArrivalIds,
          bestSelling: bestSellingIds,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    const featured = await fetchProductSummariesInOrder(updated.featuredProducts || []);
    const arrivals = await fetchProductSummariesInOrder(updated.newArrivals || []);
    const best = await fetchProductSummariesInOrder(updated.bestSelling || []);

    return res.json({
      ...(updated.data || {}),
      featuredProducts: featured,
      newArrivals: arrivals,
      bestSelling: best,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to save settings." });
  }
};
