import { Router } from "express";
import { createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from "../../controllers/coupon.controller.js";
import { isLoggedIn, authorize } from "../../Middlewares/auth.middleware.js"
import AuthRoles from "../../utils/authRoles.js";

const router = Router();

//creating coupon
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCoupon);

//deleting a coupon
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), deleteCoupon);

//updating a coupon
router.put("/action/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), updateCoupon);

//getting all the coupons
router.get("/", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), getAllCoupons);

export default router;