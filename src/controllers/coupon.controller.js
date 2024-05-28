import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError";

export const createCoupon = asyncHandler( async(req, res) => {
    const {code, discount} = req.body;

    if (
        !code ||
        !discount
    ) {
        throw new customError("Please provide coupon code and discount", 400);
    }

    const existingCoupon = await Coupon.findOne({code});
    if (existingCoupon) {
        throw new customError("Coupon already exists", 400);
    }

    const coupon = await Coupon.create({
        code,
        discount
    });

    res.status(200).json({
        success: true,
        message: "Coupon created successfully",
        coupon
    })
});

export const updateCoupon = asyncHandler( async(req, res) => {
    const {id: couponId} = req.params;
    const {action} = req.body;

    let updatedCoupon = await Coupon.findByIdAndUpdate(couponId, {
        active: action
    }, {
        new: true,
        runValidators: true
    });

    if (action !== Boolean) {
        throw new customError("Only boolean value is accepted", 400);
    }

    if (!updatedCoupon) {
        throw new customError("Coupon not found to update", 404);
    }

    res.status(200).json({
        success: true,
        message: "Coupon updated successfully",
        updatedCoupon
    })
});

export const deleteCoupon = asyncHandler( async(req, res) => {
    const {id: couponId} = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
        throw new customError("Coupon not found to delete", 404);
    }

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
    })
});

export const getAllCoupons = asyncHandler( async(req, res) => {
    const allCoupons = await Coupon.find();

    if (!allCoupons) {
        throw new customError("No coupons found", 404);
    }

    res.status(200).json({
        success: true,
        allCoupons
    })
})