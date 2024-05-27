// signup a new user 

import asyncHandler from "../utils/asynchHandler.js"
import customError from "../utils/customError.js"
import User from "../models/user.schema.js"

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true
}

/** 
 * @SIGNUP
 * @route http://localhost:5000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @returns User Object
*/

export const signup = asyncHandler( async (req, res) => {
    // get data from user
    const {name, email, password} = req.body;

    //validations
    if (!name || !email || !password) {
        throw new customError("Please add all feilds", 400);
    }

    // lets add this data to database
    // check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new customError("User already exists", 400);
    }

    // creating user if all condtions touches the requirment
    const user = await User.create({
        name,
        email,
        password
    });

    const token = user.getJWTtoken();
    // safety
    user.password = undefined;

    // store this token in user's cookie
    res.cookie("token", token, cookieOptions)

    //send back a response to user
    res.status(200).json({
        success: true,
        token,
        user
    })
});

export const login = asyncHandler( async (req, res) => {
    const {email, password} = req.body;

    // validation
    if (!email || !password) {
        throw new customError("Please provide all the details", 400);
    }

    const user = User.findOne({email}).select("+password");

    if (!user) {
        throw new customError("Invalid user", 400);
    }

    console.log(user.comparePassword)
    const isPasswordMatched = await user.comparePassword(password)

    if (isPasswordMatched) {
        const token = user.getJWTtoken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new customError("Password is incorrect", 400);
})

export const logout = asyncHandler( async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "User has been Logged out"
    })
})

export const getProfile = asyncHandler( async (req, res) => {
    const {user} = req;

    if (!user) {
        throw new customError("User not found", 404);
    }

    res.status(200).json({
        success: true,
        user
    })
});

export const forgotPassword = asyncHandler( async(req, res) => {
    const {email} = req.body;

    if (!email) {
        throw new customError("Email is required", 400);
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new customError("User not found", 404);
    }

    const resetToken = user.generateForgotPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows /n/n ${resetPasswordUrl} /n/n if this was not requested by you, please ignore this mail.`;

    
});
