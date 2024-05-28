import { Router } from "express";
import { getProfile, login, logout, signup } from "../../controllers/auth.controller.js";
import { isLoggedIn } from "../../Middlewares/auth.middleware.js"

const router = Router();

//creating a new user
router.post("/signup", signup);

//logging in to an existing user
router.post("/login", login);

//logging out from a logged in user
router.get("/logout", logout);

//getting all the profiles
router.post("/profile", isLoggedIn, getProfile);


export default router;