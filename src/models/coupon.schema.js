import mongoose from "mongoose";

const counponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Please provide a coupon code"]
        },
        discount: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {timestamps: true}
)

export default mongoose.model("coupon", counponSchema)