import Product from "../models/product.schema.js";
import formidable from "formidable";
import {s3FileUpload, s3FileDelete} from "../utils/imageUpload.js";
import Mongoose from "mongoose";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";
import config from "../config/index.js";
import fs from "fs"

/**
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @description Uses AWS S3 Bucket for image upload
 * @returns Product Object
 */

export const addProduct = asyncHandler( async(req, res) => {
    try {
        const form = formidable({ multiples: true, keepExtensions: true});

    form.parse(req, async(err, feilds, files) => {
        if (err) {
            throw new customError(err.message || "Something went wrong while uploading image", 500)
        }

        let productId = new Mongoose.Types.ObjectId().toHexString();

        // console.log(feilds, files);

        if (
            !feilds.name ||
            !feilds.price ||
            !feilds.description ||
            !feilds.collectionId
        ) {
            throw new customError("Please fill all these feilds", 400);
        }

        let imgArrayResponse = Promise.all(
            Object.keys(files).map( async(file, index) => {
                const element = file[filekey];
                // console.log(element);
                const data = fs.readFileSync(element.filepath);

                const upload = await s3FileUpload({
                    bucketName: config.S3_BUCKET_NAME,
                    key: `products/${productId}/photo_${index + 1}.png`,
                    body: data,
                    contentType: element.mimeType
                })

                return {
                    secure_url: upload
                }
            })
        )

        let imgArray = await imgArrayResponse;

        const productCreate = await Product.create({
            _id: productId,
            photos: imgArray,
            ...feilds
        })

        if (!productCreate) {
            throw new customError("No products found to save", 400);
        }
        res.status(200).json({
            success: true,
            productCreate
        })
    })
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message && "Error while creating the product"
        })
    }
});
//wrapped the code in one extra trycatch to make sure errors have been caught

export const getAllProduct = asyncHandler( async(req, res) => {
    const products = await Product.find({});
    
    if (!products) {
        throw new customError("No products found", 404);
    }

    res.status(200).json({
        success: true,
        products
    })
});

export const getProductById = asyncHandler( async(req, res) => {
    const {id: productId} = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new customError("No product found", 404);
    }

    res.status(200).json({
        success: true,
        product
    })
});

export const getProductByCollectionId = asyncHandler( async(req, res) => {
    const {id: collectionId} = req.params;

    const products = await Product.find({collectionId});

    if (!products) {
        throw new customError("No products found", 404);
    }

    res.status(200).json({
        success: true,
        products
    })
});

export const updateProduct = asyncHandler( async(req, res) => {
    const {id: productId} = req.params;
    const product = await Product.findById(productId);

    const deletePhotos = Promise.all(
        product.photos.map( async(elem, index) => {
            await s3FileDelete({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${product._id.toString()}/photo_${index + 1}.png`
            })
        })
    );
    
    await deletePhotos;

    try {
        const form = formidable({ multiples: true, keepExtensions: true});

        form.parse(req, async(err, feilds, files) => {
            if (err) {
                throw new customError(err.message || "Something went wrong while updating the image", 500);
            }

            let productId = new Mongoose.Types.ObjectId().toHexString();

            if (
                !feilds.name ||
                !feilds.price ||
                !feilds.description ||
                !feilds.collectionId
            ) {
                throw new customError("Please fill all these feilds", 400);
            }

            let imgArrayResponse = Promise.all(
                Object.keys(files).map( async(file, index) => {
                    const element = file[filekey];
                    const data = fs.readFileSync(element.filepath);

                    const update = await s3FileUpload({
                        bucketName: config.S3_BUCKET_NAME,
                        key: `products/${productId}/photo_${index + 1}.png`,
                        body: data,
                        contentType: element.mimeType
                    })

                    return {
                        secure_url: update
                    }

                })
            )

            let imgArray = await imgArrayResponse;

            let productUpdate = await Product.findByIdAndUpdate(productId, {
                id: productId,
                photos: imgArray,
                ...feilds
            }, {
                new: true,
                runValidators: true
            });

            if (!productUpdate) {
                throw new customError("No product found to update", 404);
            }
        })
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message && "Error while updating the product"
        })
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        productUpdate
    })
});

export const deleteProduct = asyncHandler( async(req, res) => {
    const {id: productId} = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new customError("Product not found to delete", 404);
    }

    const deletePhotos = Promise.all(
        product.photos.map( async(elem, index) => {
            await s3FileDelete({
                bucketName: config.S3_BUCKET_NAME,
                key: `products/${product._id.toString()}/photo_${index + 1}.png`
            })
        })
    );

    await deletePhotos;

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })

});
