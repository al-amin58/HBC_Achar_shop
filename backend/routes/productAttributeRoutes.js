import express from "express";
import {
  createProductAttribute,
  deleteProductAttribute,
  getProductAttributes,
  updateProductAttribute,
} from "../controllers/backend/productAttributeController.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.use(adminAuthMiddleware);
router.get("/", getProductAttributes);
router.post("/", createProductAttribute);
router.put("/:id", updateProductAttribute);
router.delete("/:id", deleteProductAttribute);

export default router;
