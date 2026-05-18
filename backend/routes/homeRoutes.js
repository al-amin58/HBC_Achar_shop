import express from "express";
import { getHomePageData, getProductById, getProducts, getSubCategories } from "../controllers/website/homeController.js";

const router = express.Router();

// Public — no auth required
router.get("/", getHomePageData);
router.get("/products", getProducts);
router.get("/subcategories", getSubCategories);
router.get("/product/:id", getProductById);

export default router;
