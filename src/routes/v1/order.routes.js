import { Router } from "express";
import { createOrder, generateRazorpayOrderId, getAllOrders, getMyOrders, deleteOrder, updateOrderStatus } from "../../controllers/order.controller.js";
import { isLoggedIn, authorize } from "../../Middlewares/auth.middleware.js"
import AuthRoles from "../../utils/authRoles.js";

const router = Router();

//creating new order with razorpay as middleware
router.post("/", generateRazorpayOrderId, isLoggedIn, createOrder);

//getting all of the orders, only accessible to admin
router.get("/", isLoggedIn, authorize(AuthRoles.ADMIN), getAllOrders);

//getting all orders from a user, accessible by all
router.get("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR, AuthRoles.USER), getMyOrders);

//deleting an order, only accessible fora admin
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteOrder);

//updating status of the order, accessible for admin and moderators
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), updateOrderStatus)

export default router