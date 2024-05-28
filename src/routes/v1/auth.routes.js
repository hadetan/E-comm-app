import { Router } from "express";
import { forgotPassword, getProfile, login, logout, resetPassword, signup } from "../../controllers/auth.controller.js";
import { isLoggedIn } from "../../Middlewares/auth.middleware.js"

const router = Router();

//creating a new user
router.post("/signup", signup);

//logging in to an existing user
router.post("/login", login);

//logging out from a logged in user
router.get("/logout", logout);

//for forgot password
router.post("/password/forgot", forgotPassword);

//for resetting the password
router.post("/password/reset/:token", resetPassword);

//getting all the profiles
router.post("/profile", isLoggedIn, getProfile);


export default router;