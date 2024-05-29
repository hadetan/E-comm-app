import Order from "../models/order.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";
import Product from "../models/product.schema.js"
import Coupon from "../models/coupon.schema.js"


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
})


export const createOrder = asyncHandler( async(req, res) => {
    const {product, user, address, phoneNumber, amount} = req.body;

    if (
        !product ||
        !user ||
        !address ||
        !phoneNumber ||
        !amount
    ) {
        throw new customError("Please fill all the feilds", 400)
    }

    const order = Order.create({
        product,
        user,
        address,
        phoneNumber,
        amount
    });

    res.status(200).json({
        success: true,
        message: "order created successfully",
        order
    })
});

export const updateOrder = asyncHandler( async(req, res) => {
    const {address, phoneNumber} = req.body;
    const {id: orderId} = req.params;

    if (
        !address ||
        !phoneNumber
    ) {
        throw new customError("Please fill all the feilds", 400)
    }

    let updatedOrder = await Order.findByIdAndUpdate(orderId, {
        address,
        phoneNumber
    }, {
        new: true,
        runValidators: true
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

export const getAllOrders = asyncHandler( async(req, res) => {
    const orders = await Order.find();

    if (!orders) {
        throw new customError("No order found", 404);
    }

    res.status(200).json({
        success: true,
        orders
    })
})