import express from "express";
import { getProductById } from "../controllers/website/homeController.js";

const router = express.Router();

router.get("/:id", getProductById);

export default router;
