import mongoose from "mongoose";
import ProductAttribute from "../../models/ProductAttribute.js";
import ProductVariation from "../../models/ProductVariation.js";

const formatAttribute = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    _id: o._id,
    name: o.name,
    values: o.values,
    order: o.order ?? 0,
  };
};

export const getProductAttributes = async (_req, res) => {
  try {
    const list = await ProductAttribute.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json(list.map(formatAttribute));
  } catch {
    return res.status(500).json({ message: "Failed to fetch attributes." });
  }
};

export const createProductAttribute = async (req, res) => {
  try {
    const { name, values } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Attribute name is required." });
    }

    if (!Array.isArray(values) || values.length === 0) {
      return res.status(400).json({ message: "At least one value is required." });
    }

    const cleanedValues = [...new Set(values.map((v) => String(v).trim()).filter(Boolean))];
    if (cleanedValues.length === 0) {
      return res.status(400).json({ message: "At least one non-empty value is required." });
    }

    const count = await ProductAttribute.countDocuments();
    const attribute = await ProductAttribute.create({
      name: String(name).trim(),
      values: cleanedValues,
      order: count,
    });

    return res.status(201).json({
      message: "Attribute created successfully.",
      attribute: formatAttribute(attribute),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(" ");
      return res.status(400).json({ message: msg || "Validation failed." });
    }
    return res.status(500).json({
      message: error.message || "Failed to create attribute.",
    });
  }
};

export const updateProductAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, values, order } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attribute id." });
    }

    const attribute = await ProductAttribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found." });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: "Attribute name cannot be empty." });
      }
      attribute.name = String(name).trim();
    }

    if (values !== undefined) {
      if (!Array.isArray(values) || values.length === 0) {
        return res.status(400).json({ message: "At least one value is required." });
      }
      const cleanedValues = [...new Set(values.map((v) => String(v).trim()).filter(Boolean))];
      if (cleanedValues.length === 0) {
        return res.status(400).json({ message: "At least one non-empty value is required." });
      }
      attribute.values = cleanedValues;
    }

    if (order !== undefined && Number.isFinite(Number(order))) {
      attribute.order = Number(order);
    }

    await attribute.save();

    return res.status(200).json({
      message: "Attribute updated successfully.",
      attribute: formatAttribute(attribute),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors || {})
        .map((e) => e.message)
        .join(" ");
      return res.status(400).json({ message: msg || "Validation failed." });
    }
    return res.status(500).json({
      message: error.message || "Failed to update attribute.",
    });
  }
};

export const deleteProductAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid attribute id." });
    }

    const attribute = await ProductAttribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found." });
    }

    await ProductVariation.deleteMany({ "combination.attributeId": id });
    await ProductAttribute.findByIdAndDelete(id);

    return res.status(200).json({ message: "Attribute deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Failed to delete attribute." });
  }
};
