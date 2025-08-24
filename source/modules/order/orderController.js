import { bookModel } from "../../../database/models/bookModel.js";
import { orderModel } from "../../../database/models/orderModel.js";
import { userModel } from "../../../database/models/userModel.js";

// Create order from user's cart
const createOrder = async (req, res) => {
    try {
        const userId = req.params.id;
        const { shippingAddress, paymentMethod = 'cash_on_delivery', notes } = req.body;

        // Get user with populated cart
        const user = await userModel.findById(userId).populate('cart.items.bookId');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if cart is empty
        if (user.cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Validate stock and calculate totals
        let subtotal = 0;

        for (const item of user.cart.items) {
            const book = await bookModel.findById(item.bookId._id);

            if (!book) {
                return res.status(404).json({
                    message: `Book "${item.name}" no longer available`
                });
            }

            if (book.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for "${item.name}". Only ${book.stock} available.`
                });
            }

            subtotal += item.price * item.quantity;
        }

        const tax = req.body.tax || 0; // Example: subtotal * 0.14 for 14% tax
        const shipping = req.body.shipping || 0; // Example: calculate based on address
        const total = subtotal + tax + shipping;

        // Create order
        const order = await orderModel.create({
            user: userId,
            items: user.cart.items.map(item => ({
                bookId: item.bookId._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            notes: notes,
            paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid'
        });

        // Update book stock
        for (const item of user.cart.items) {
            await bookModel.findByIdAndUpdate(
                item.bookId._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Clear user's cart
        user.cart = { items: [], total: 0 };
        await user.save();

        // Populate order with user details for response
        const populatedOrder = await orderModel.findById(order._id)
            .populate('user', 'name email')
            .populate('items.bookId', 'title author');

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: populatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.id;

        const orders = await orderModel.find({ user: userId })
            .populate('items.bookId', 'title author coverImage')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.params.id;

        const order = await orderModel.findOne({
            _id: orderId,
            user: userId
        }).populate('items.bookId', 'title author coverImage description');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('user', 'name email')
            .populate('items.bookId', 'title author')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { status, trackingNumber, carrier } = req.body;

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            {
                status,
                ...(trackingNumber && { trackingNumber }),
                ...(carrier && { carrier })
            },
            { new: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order status updated",
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.params.id;

        const order = await orderModel.findOne({
            _id: orderId,
            user: userId,
            status: { $in: ['pending', 'confirmed'] } // Only allow cancellation for these statuses
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found or cannot be cancelled"
            });
        }

        // Restore stock
        for (const item of order.items) {
            await bookModel.findByIdAndUpdate(
                item.bookId,
                { $inc: { stock: item.quantity } }
            );
        }

        // Update order status
        order.status = 'cancelled';
        await order.save();

        res.json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createOrder,
    getUserOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};