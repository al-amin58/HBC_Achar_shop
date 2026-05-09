import mongoose from "mongoose";
import Category from "../../models/Category.js";

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories." });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const finalSlug = makeSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ message: "Valid slug is required." });
    }

    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ message: "Category slug already exists." });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: finalSlug,
      status: status === "inactive" ? "inactive" : "active",
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create category." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    const nextName = name?.trim() || category.name;
    const nextSlug = makeSlug(slug || (name ? nextName : category.slug));

    if (!nextSlug) {
      return res.status(400).json({ message: "Valid slug is required." });
    }

    const duplicate = await Category.findOne({
      slug: nextSlug,
      _id: { $ne: id },
    });
    if (duplicate) {
      return res.status(400).json({ message: "Category slug already exists." });
    }

    category.name = nextName;
    category.slug = nextSlug;
    if (status) {
      category.status = status === "inactive" ? "inactive" : "active";
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update category." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category id." });
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete category." });
  }
};
