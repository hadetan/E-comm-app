import mongoose from "mongoose";
import authRoles from "../utils/authRoles.js"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: ["true", "Name is required"],
            maxLength: [50, "Name must be less than 50 characters"]
        },
        email: {
            type: String,
            required: ["true", "Email is required"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLenght: [8, "Password must be at least 8 characters long"],
            select: false
        },
        role: {
            type: String,
            enum: Object.values(authRoles),
            default: authRoles.USER
        },
        forgotPasswordToken: String,
        forgotPasswordExpiry: Date
    }, 
    {timestamps: true}
)

export default mongoose.model("User", userSchema);