import express from "express";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";
import { getPublicSettings, getSettings, upsertSettings } from "../controllers/backend/settingsController.js";

const router = express.Router();

router.get("/public", getPublicSettings);

router.use(adminAuthMiddleware);

router.get("/", getSettings);
router.put("/", upsertSettings);

export default router;
