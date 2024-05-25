import { Router } from "express";
import { getProfile, login, logout, signup } from "../../controllers/auth.controller.js";
import { isLoggedIn } from "../../Middlewares/auth.middleware.js"

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.post("/profile", isLoggedIn, getProfile);


export default router;