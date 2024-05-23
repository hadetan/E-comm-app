// signup a new user 

import asyncHandler from "../utils/asynchHandler"
import customError from "../utils/customError"
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

    const user = User.findOne({email}).select("+password")

    if (!user) {
        throw new customError("Invalid user", 400);
    }

    const passwordMatched = await user.comparePassword(password);

    if (passwordMatched) {
        const token = user.getJWTtoken;
        user.password = undefined;
        res.cookie("token", token, cookieOptions);
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new customError("Password is incorrect", 400);
})