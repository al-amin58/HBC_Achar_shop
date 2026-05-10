import mongoose from "mongoose";
import Product from "../../models/Product.js";

const toObjectId = (value) => {
  if (!value || value === "") return null;
  return mongoose.Types.ObjectId.isValid(value) ? value : null;
};

export const getProducts = async (_req, res) => {
  try {
    const list = await Product.find()
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ createdAt: -1 });
    return res.status(200).json(list);
  } catch {
    return res.status(500).json({ message: "Failed to fetch products." });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      variant,
      sku,
      category,
      subCategory,
      brand,
      price,
      originalPrice,
      stock,
      sold,
      rating,
      status,
      featured,
      image,
      images,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Product name is required." });
    }
    if (!sku || !String(sku).trim()) {
      return res.status(400).json({ message: "SKU is required." });
    }
    if (price === undefined || price === null || Number.isNaN(Number(price))) {
      return res.status(400).json({ message: "Valid price is required." });
    }

    const existing = await Product.findOne({ sku: String(sku).trim() });
    if (existing) {
      return res.status(400).json({ message: "SKU already exists." });
    }

    const catId = toObjectId(category);
    const subId = toObjectId(subCategory);

    const product = await Product.create({
      name: String(name).trim(),
      variant: variant != null ? String(variant).trim() : "",
      sku: String(sku).trim(),
      category: catId,
      subCategory: subId,
      brand: brand != null ? String(brand).trim() : "",
      price: Number(price),
      originalPrice:
        originalPrice === null || originalPrice === "" || originalPrice === undefined
          ? null
          : Number(originalPrice),
      stock: stock != null ? Math.max(0, Number(stock)) : 0,
      sold: sold != null ? Math.max(0, Number(sold)) : 0,
      rating: rating != null ? Math.min(5, Math.max(0, Number(rating))) : 0,
      status: ["active", "flash", "outstock", "draft"].includes(status) ? status : "active",
      featured: Boolean(featured),
      image: image != null ? String(image).trim() : "",
      images: Array.isArray(images) ? images.map((u) => String(u).trim()).filter(Boolean) : [],
      seoTitle: seoTitle != null ? String(seoTitle).trim() : "",
      seoDescription: seoDescription != null ? String(seoDescription).trim() : "",
    });

    const populated = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("subCategory", "name slug");

    return res.status(201).json({
      message: "Product created successfully.",
      product: populated,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "SKU already exists." });
    }
    return res.status(500).json({ message: "Failed to create product." });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const {
      name,
      variant,
      sku,
      category,
      subCategory,
      brand,
      price,
      originalPrice,
      stock,
      sold,
      rating,
      status,
      featured,
      image,
      images,
      seoTitle,
      seoDescription,
    } = req.body;

    if (sku !== undefined && String(sku).trim() !== product.sku) {
      const taken = await Product.findOne({ sku: String(sku).trim(), _id: { $ne: id } });
      if (taken) {
        return res.status(400).json({ message: "SKU already exists." });
      }
      product.sku = String(sku).trim();
    }

    if (name !== undefined) product.name = String(name).trim();
    if (variant !== undefined) product.variant = String(variant).trim();
    if (brand !== undefined) product.brand = String(brand).trim();
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) {
      product.originalPrice =
        originalPrice === null || originalPrice === "" ? null : Number(originalPrice);
    }
    if (stock !== undefined) product.stock = Math.max(0, Number(stock));
    if (sold !== undefined) product.sold = Math.max(0, Number(sold));
    if (rating !== undefined) product.rating = Math.min(5, Math.max(0, Number(rating)));
    if (status !== undefined && ["active", "flash", "outstock", "draft"].includes(status)) {
      product.status = status;
    }
    if (featured !== undefined) product.featured = Boolean(featured);
    if (image !== undefined) product.image = String(image).trim();
    if (images !== undefined) {
      product.images = Array.isArray(images) ? images.map((u) => String(u).trim()).filter(Boolean) : [];
    }
    if (seoTitle !== undefined) product.seoTitle = String(seoTitle).trim();
    if (seoDescription !== undefined) product.seoDescription = String(seoDescription).trim();
    if (category !== undefined) product.category = toObjectId(category);
    if (subCategory !== undefined) product.subCategory = toObjectId(subCategory);

    if (!product.name) {
      return res.status(400).json({ message: "Product name is required." });
    }

    await product.save();

    const populated = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("subCategory", "name slug");

    return res.status(200).json({
      message: "Product updated successfully.",
      product: populated,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ message: "SKU already exists." });
    }
    return res.status(500).json({ message: "Failed to update product." });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({ message: "Product deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Failed to delete product." });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Provide an array of product ids." });
    }

    const valid = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (valid.length === 0) {
      return res.status(400).json({ message: "No valid product ids." });
    }

    const result = await Product.deleteMany({ _id: { $in: valid } });

    return res.status(200).json({
      message: "Products deleted successfully.",
      deletedCount: result.deletedCount,
    });
  } catch {
    return res.status(500).json({ message: "Failed to delete products." });
  }
};
