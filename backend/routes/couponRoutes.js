import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getActiveCoupons,
  getCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/backend/couponController.js";
import { adminAuthMiddleware } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/active", getActiveCoupons);
router.post("/validate", validateCoupon);

router.use(adminAuthMiddleware);
router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
