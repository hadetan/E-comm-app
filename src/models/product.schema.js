import mongoose from "mongoose";
import collectionSchema from "./collection.schema.js";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            trim: true,
            maxLength: [120, "Product name should not be more than 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            maxLength: [20, "Product price must not be more than 20 digits"],
        },
        description: {
            type: String,
            required: [true, "Please provide a product description"],
            maxLength: [120, "Product description must not be more than 120 characters"]
        },
        photos: [
            {
                secure_url: {
                    type: String,
                    required: true
                }
            }
        ],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            required: true
        }
    },
    {timestamps: true}
)

export default mongoose.model("Product", productSchema)