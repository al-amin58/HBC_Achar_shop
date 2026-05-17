import express from "express";
import { getHomePageData } from "../controllers/website/homeController.js";

const router = express.Router();

// Public — no auth required
router.get("/", getHomePageData);

export default router;
