import express from "express";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";
import {
  getPublicSettings,
  getSettings,
  getWebConfig,
  upsertSettings,
  upsertWebConfig,
} from "../controllers/backend/settingsController.js";

const router = express.Router();

router.get("/public", getPublicSettings);

router.use(adminAuthMiddleware);

router.get("/", getSettings);
router.put("/", upsertSettings);
router.get("/web-config", getWebConfig);
router.put("/web-config", upsertWebConfig);

export default router;
