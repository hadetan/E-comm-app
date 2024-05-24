import JWT from "jsonwebtoken";
import User from "../models/user.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import config from "../config/index.js";
import customError from "../utils/customError.js";

export const isLoggedIn = asyncHandler( async (req, res, next) => {
    let token;

    if (req.cookie.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookie.body || req.headers.authorization.split(" ")[1]
        //token = "Bearer sdfosdfopjre3243klnac"
    }

    if (!token) {
        throw new customError("Not authorized to access this resource", 400)
    }

    try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

        req.user = await User.findById(decodedJwtPayload._id, "name email role");
        next();

    } catch (error) {
        throw new customError("Not authorized to access this route", 400)
    }
});

export const authorize = (...requiredRoles) => asyncHandler( async (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
        throw new customError("You are not authorized to access this resource", 400)
    }
    next();
});