import { model, Schema } from "mongoose";

const orderSchema = new Schema({
    // User Reference
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Order Items (copied from cart)
    items: [{
        bookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String
    }],

    // Pricing
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    shipping: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },

    // Order Status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Shipping Information
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },

    // Payment Information
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery'],
        default: 'cash_on_delivery'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },

    // Tracking
    trackingNumber: String,
    carrier: String,

    // Notes
    notes: String

}, {
    timestamps: true
});

export const orderModel = model('Order', orderSchema);