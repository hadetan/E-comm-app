import Order from "../models/order.schema.js";
import asyncHandler from "../utils/asynchHandler.js";
import customError from "../utils/customError.js";

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