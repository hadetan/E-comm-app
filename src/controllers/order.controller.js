import Order from "../models/order.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";
import Product from "../models/product.schema.js"
import Coupon from "../models/coupon.schema.js"
import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus.js";


export const generateRazorpayOrderId = asyncHandler( async(req, res) => {
    const {products, couponCode} = req.body;

    if (
        !products ||
        products.lenght === 0
    ) {
        throw new customError("No products found", 404);
    }

    let totalAmount = 0;
    let discountAmount = 0;

    let productPriceCalc = Promise.all(
        products.map(async (product) => {
            const {productId, count} = product;
            const productFromDB = await Product.findById(productId);

            if (!productFromDB) {
                throw new customError("Product not found", 404);
            }

            if (productFromDB.stock < count) {
                return res.status(400).json({
                    error: "Product is out of stock"
                })
            }

            totalAmount += productFromDB.price * count;

            discountPercentage = await discountCalc(totalAmount);
    
            discount = totalAmount * (discountPercentage / 100)
    
            discountAmount += totalAmount - discount;
        })
    )

    async function discountCalc(couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode, active: true});

        if (!coupon) {
            return 0;
        }

        return coupon.discount
    }

    await productPriceCalc;

    const options = {
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
        throw new customError("Unable to generate order", 400);
    }

    res.status(200).json({
        success: true,
        message: "Razorpay order id generated successfully",
        order
    })
});

export const createOrder = asyncHandler( async(req, res) => {
    const {products, user, address, phoneNumber, amount, transactionId, coupon} = req.body;
    const productVals = await Product.findById(product);

    if (!productVals) {
        throw new customError("Product not found", 404);
    }

    if (productVals.stock === 0) {
        throw new customError("Product is out of stock", 400)
    }

    productVals.stock -= 1;
    productVals.sold += 1;

    await productVals.save()

    if (
        !products ||
        !user ||
        !address ||
        !phoneNumber ||
        !amount || 
        !transactionId
    ) {
        throw new customError("Please fill all the feilds", 400)
    }

    const order = Order.create({
        products,
        user,
        address,
        phoneNumber,
        amount,
        transactionId,
        coupon
    });

    res.status(200).json({
        success: true,
        message: "order created successfully",
        order,
        stock: productVals.stock,
        sold: productVals.sold
    })
});

// getAllOrders: ADMIN
export const getAllOrders = asyncHandler( async(req, res) => {
    const orders = await Order.find();

    if (!orders) {
        throw new customError("No order found", 404);
    }

    res.status(200).json({
        success: true,
        orders
    })
});

//getAllorders from a user
export const getMyOrders = asyncHandler( async(req, res) => {
    const {id: userId} = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new customError("Invalid user id", 400);
    }

    const orders = await Order.find({userId: userId});

    if (!orders.length) {
        throw new customError("No order found for this user", 404);
    }

    res.status(200).json({
        success: true,
        orders
    })
});

//update for admins
export const updateOrderStatus = asyncHandler( async(req, res) => {
    const {status} = req.body;
    const {id: orderId} = req.params;

    if (
        !status
    ) {
        throw new customError("Please fill the feild", 400)
    }

    if (!Object.values(orderStatus).includes(status)) {
        throw new customError("Invalid status value", 400)
    }

    let updatedOrder = await Order.findByIdAndUpdate(orderId, {
        status
    }, {
        new: true,
        runValidators: false
    });

    if (!updatedOrder) {
        throw new customError("Order not found to update", 404);
    }

    res.status(200).json({
        success: true,
        message: "Order updated successfully",
        updatedOrder
    })
});

export const deleteOrder = asyncHandler( async(req, res) => {
    const {id: orderId} = req.params;

    const deletedOrder = await Order.findById(orderId);

    if (!deletedOrder) {
        throw new customError("Order not found to delete", 404);
    }

    await deletedOrder.remove();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    })
});