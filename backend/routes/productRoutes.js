import express from "express";
import {
  bulkDeleteProducts,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../controllers/backend/productController.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.use(adminAuthMiddleware);
router.get("/", getProducts);
router.post("/bulk-delete", bulkDeleteProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
