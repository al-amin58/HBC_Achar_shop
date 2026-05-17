import Product from "../../models/Product.js";
import ProductVariation from "../../models/ProductVariation.js";
import Settings from "../../models/Settings.js";

const SETTINGS_KEY = "default";

/** DB string/number → number or null */
const toPrice = (val) => {
  if (val == null || val === "") return null;
  const n = Number(String(val).replace(/,/g, "").trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
};

/**
 * Product + variations populate করে Home page format এ return করে
 */
const formatProduct = (p, extraFields = {}) => {
  if (!p || p._id == null) return null;

  const isFlashProduct = Boolean(extraFields.isFlash) || p.status === "flash";
  const productFlashPrice = toPrice(p.price);
  const productOriginalPrice = toPrice(p.originalPrice);

  const variations = (p.variationIds || [])
    .filter((v) => v != null)
    .map((v) => {
      const varDoc =
        v && typeof v === "object" && !(v instanceof Date) && v._id != null ? v : null;
      const varId = varDoc ? String(varDoc._id) : v != null ? String(v) : "";
      if (!varId || varId === "undefined" || varId === "null") return null;

      const useFlashPrice = isFlashProduct || Boolean(varDoc?.flashSale);
      const regularVarPrice = toPrice(varDoc?.price);
      const flashVarPrice = toPrice(varDoc?.discountPrice);

      let price = regularVarPrice ?? 0;
      let originalPrice = null;

      if (useFlashPrice) {
        // Flash Sale: discountPrice → else product flash price → else variation price
        price = flashVarPrice ?? productFlashPrice ?? regularVarPrice ?? 0;
        originalPrice = regularVarPrice ?? productOriginalPrice ?? null;
      }

      return {
        id: varId,
        label: varDoc?.combination?.length
          ? varDoc.combination.map((c) => c.value).join(" / ")
          : varDoc?.sku || "Variation",
        price,
        discountPrice: flashVarPrice,
        originalPrice,
        stock: Number(varDoc?.stock) || 0,
        flashSale: useFlashPrice,
        image: varDoc?.image || null,
      };
    })
    .filter(Boolean)
    .filter((v) => v.id && v.id !== "undefined" && !Number.isNaN(v.price));

  // Flash product card: show lowest flash variation price, or product flash price
  let cardPrice = productFlashPrice ?? 0;
  let cardOldPrice = productOriginalPrice;

  if (isFlashProduct && variations.length > 0) {
    const flashPrices = variations.map((v) => v.price).filter((n) => n > 0);
    if (flashPrices.length) cardPrice = Math.min(...flashPrices);
    const oldPrices = variations
      .map((v) => v.originalPrice)
      .filter((n) => n != null && n > 0);
    if (oldPrices.length) cardOldPrice = Math.max(...oldPrices);
  }

  return {
    id: String(p._id),
    name: p.name,
    price: isFlashProduct ? cardPrice : (productFlashPrice ?? p.price),
    oldPrice: isFlashProduct ? cardOldPrice : (productOriginalPrice || null),
    image: p.image || "",
    images: p.images || [],
    rating: p.rating || 0,
    sold: p.sold || 0,
    stock: p.stock || 0,
    status: p.status,
    featured: p.featured || false,
    sku: p.sku,
    brand: p.brand || "",
    description: p.description || "",
    category:
      p.category && p.category._id
        ? { id: String(p.category._id), name: p.category.name, slug: p.category.slug }
        : null,
    subCategory:
      p.subCategory && p.subCategory._id
        ? { id: String(p.subCategory._id), name: p.subCategory.name, slug: p.subCategory.slug }
        : null,
    variations,
    isFlash: isFlashProduct,
    ...extraFields,
  };
};

const productPopulate = [
  { path: "category", select: "name slug" },
  { path: "subCategory", select: "name slug" },
  { path: "variationIds", select: "sku combination price discountPrice stock flashSale image" },
];

/**
 * GET /api/home  — Public endpoint
 * Flash Sale, Featured, New Arrivals, Best Selling sections এর data return করে
 */
export const getHomePageData = async (_req, res) => {
  try {
    // ─── 1. Settings doc fetch ──────────────────────────────────────────────
    let settingsDoc = await Settings.findOne({ key: SETTINGS_KEY }).lean();
    if (!settingsDoc) {
      settingsDoc = { featuredProducts: [], newArrivals: [], bestSelling: [] };
    }

    const settingsData = settingsDoc?.data && typeof settingsDoc.data === "object"
      ? settingsDoc.data
      : {};

    const featuredIds = (settingsDoc.featuredProducts || []).map(String);
    const newArrivalIds = (settingsDoc.newArrivals || []).map(String);
    const bestSellingIds = (settingsDoc.bestSelling || []).map(String);

    // Flash Sale end time
    // DB তে flashTimer (hours) থাকলে flashSaleEndsAt calculate করে save করবে (একবার)
    // এরপর থেকে stored flashSaleEndsAt ব্যবহার করবে — timer reset হবে না
    let flashSaleEndsAt = settingsData.flashSaleEndsAt || null;

    if (!flashSaleEndsAt && settingsData.flashTimer) {
      const hours = Number(settingsData.flashTimer);
      if (!isNaN(hours) && hours > 0) {
        flashSaleEndsAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        // DB তে save করে রাখি যাতে পরের বার recalculate না হয়
        await Settings.findOneAndUpdate(
          { key: SETTINGS_KEY },
          { $set: { "data.flashSaleEndsAt": flashSaleEndsAt } }
        );
      }
    }

    // ─── 2. Flash Sale products (status = "flash") ─────────────────────────
    const flashRaw = await Product.find({ status: "flash" })
      .populate(productPopulate)
      .sort({ createdAt: -1 })
      .lean();

    const flashSaleProducts = flashRaw
      .map((p) => {
        const total = (p.stock || 0) + (p.sold || 0);
        return formatProduct(p, { total, isFlash: true });
      })
      .filter(Boolean);

    // ─── 3. Helper: IDs order অনুযায়ী products fetch ─────────────────────
    const fetchByIds = async (ids) => {
      if (!ids.length) return [];
      const rows = await Product.find({ _id: { $in: ids } })
        .populate(productPopulate)
        .lean();
      const map = new Map(rows.map((r) => [String(r._id), r]));
      return ids
        .map((id) => map.get(id))
        .filter(Boolean)
        .map((p) => formatProduct(p))
        .filter(Boolean);
    };

    // ─── 4. Featured, New Arrivals, Best Selling ───────────────────────────
    const [featuredProducts, newArrivals, bestSelling] = await Promise.all([
      fetchByIds(featuredIds),
      fetchByIds(newArrivalIds),
      fetchByIds(bestSellingIds),
    ]);

    return res.json({
      flashSaleEndsAt,
      flashSaleProducts,
      featuredProducts,
      newArrivals,
      bestSelling,
    });
  } catch (err) {
    console.error("getHomePageData error:", err);
    return res.status(500).json({ message: "Failed to load home page data." });
  }
};
