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

export const disableCoupon = asyncHandler( async(req, res) => {
    const coupon = await Coupon.findOne({active})

    if (!coupon) {
        throw new customError("Invalid coupon", 400)
    }

    const disabledCoupon = coupon.active = false;

    res.status(200).json({
        success: true,
        message: "Coupon disabled successfully"
    })
});

export const enableCoupon = asyncHandler( async(req, res) => {
    const coupon = await Coupon.findOne({active})

    if (!coupon) {
        throw new customError("Invalid coupon", 400)
    }

    const enabledCoupon = coupon.active = false;

    res.status(200).json({
        success: true,
        message: "Coupon enabled successfully",
        enabledCoupon
    })
})

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