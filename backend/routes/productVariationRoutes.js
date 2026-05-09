import express from "express";
import {
  createProductVariation,
  deleteProductVariation,
  getProductVariations,
  replaceAllProductVariations,
  updateProductVariation,
} from "../controllers/backend/productVariationController.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.use(adminAuthMiddleware);
router.get("/", getProductVariations);
router.post("/replace-all", replaceAllProductVariations);
router.post("/", createProductVariation);
router.put("/:id", updateProductVariation);
router.delete("/:id", deleteProductVariation);

export default router;
