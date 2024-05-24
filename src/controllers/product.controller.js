import Product from "../models/product.schema.js";
import formidable from "formidable";
import {s3FileUpload, s3FileDelete} from "../utils/imageUpload.js";
import Mongoose from "mongoose";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";
import config from "../config/index.js";

/**
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @description Uses AWS S3 Bucket for image upload
 * @returns Product Object
 */

export const addProduct = asyncHandler( async(req, res) => {
    const form = formidable({ multiples: true, keepExtensions: true});

    form.parse(req, async(err, feilds, files) => {
        if (err) {
            throw new customError(err.message || "Something went wrong while uploading image", 500)
        }

        let productId = new Mongoose.Types.ObjectId().toHexString();

        console.log(feilds, files);
    })
})