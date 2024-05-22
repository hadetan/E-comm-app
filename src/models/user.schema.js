import mongoose from "mongoose";
import authRoles from "../utils/authRoles.js"
import bcrypt from "bcryptjs"

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
);

// Encrypt the password before saving it.
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods = {
    // compare password
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    }
}

export default mongoose.model("User", userSchema);