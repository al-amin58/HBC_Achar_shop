import mongoose from "mongoose";
import Category from "../../models/Category.js";
import SubCategory from "../../models/SubCategory.js";

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getSubCategories = async (_req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name slug status")
      .sort({ createdAt: -1 });

    return res.status(200).json(subCategories);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch sub-categories." });
  }
};

export const createSubCategory = async (req, res) => {
  try {
    const { name, slug, category, status } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Sub-category name is required." });
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Valid parent category is required." });
    }

    const parentCategory = await Category.findById(category);
    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found." });
    }
    if (parentCategory.status !== "active") {
      return res
        .status(400)
        .json({ message: "Only active parent categories are allowed." });
    }

    const finalSlug = makeSlug(slug || name);
    if (!finalSlug) {
      return res.status(400).json({ message: "Valid slug is required." });
    }

    const existing = await SubCategory.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({ message: "Sub-category slug already exists." });
    }

    const subCategory = await SubCategory.create({
      name: name.trim(),
      slug: finalSlug,
      category,
      status: status === "inactive" ? "inactive" : "active",
    });

    parentCategory.subCategories = (parentCategory.subCategories || 0) + 1;
    await parentCategory.save();

    const populatedSubCategory = await SubCategory.findById(subCategory._id).populate(
      "category",
      "name slug status"
    );

    return res.status(201).json({
      message: "Sub-category created successfully.",
      subCategory: populatedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create sub-category." });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, category, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sub-category id." });
    }

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found." });
    }

    const nextName = name?.trim() || subCategory.name;
    const nextSlug = makeSlug(slug || (name ? nextName : subCategory.slug));
    if (!nextSlug) {
      return res.status(400).json({ message: "Valid slug is required." });
    }

    const duplicate = await SubCategory.findOne({
      slug: nextSlug,
      _id: { $ne: id },
    });
    if (duplicate) {
      return res.status(400).json({ message: "Sub-category slug already exists." });
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid parent category id." });
    }

    let nextCategoryId = subCategory.category.toString();
    if (category) {
      const targetCategory = await Category.findById(category);
      if (!targetCategory) {
        return res.status(404).json({ message: "Parent category not found." });
      }
      if (
        targetCategory.status !== "active" &&
        targetCategory._id.toString() !== subCategory.category.toString()
      ) {
        return res
          .status(400)
          .json({ message: "Only active parent categories are allowed." });
      }
      nextCategoryId = category;
    }

    if (subCategory.category.toString() !== nextCategoryId) {
      const previousCategory = await Category.findById(subCategory.category);
      const targetCategory = await Category.findById(nextCategoryId);

      if (previousCategory) {
        previousCategory.subCategories = Math.max(
          0,
          (previousCategory.subCategories || 0) - 1
        );
        await previousCategory.save();
      }

      if (targetCategory) {
        targetCategory.subCategories = (targetCategory.subCategories || 0) + 1;
        await targetCategory.save();
      }
    }

    subCategory.name = nextName;
    subCategory.slug = nextSlug;
    subCategory.category = nextCategoryId;
    if (status) {
      subCategory.status = status === "inactive" ? "inactive" : "active";
    }

    await subCategory.save();

    const populatedSubCategory = await SubCategory.findById(subCategory._id).populate(
      "category",
      "name slug status"
    );

    return res.status(200).json({
      message: "Sub-category updated successfully.",
      subCategory: populatedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update sub-category." });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sub-category id." });
    }

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return res.status(404).json({ message: "Sub-category not found." });
    }

    const parentCategory = await Category.findById(subCategory.category);
    if (parentCategory) {
      parentCategory.subCategories = Math.max(
        0,
        (parentCategory.subCategories || 0) - 1
      );
      await parentCategory.save();
    }

    await SubCategory.findByIdAndDelete(id);
    return res.status(200).json({ message: "Sub-category deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete sub-category." });
  }
};
