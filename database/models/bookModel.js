import { model, Schema } from "mongoose";

const bookSchema = new Schema({
    // Basic Identification
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    // Categorization
    genre: {
        type: String,
        required: true,
        trim: true
    },
    categories: [{
        type: String,
        trim: true
    }],
    publisher: {
        type: String,
        trim: true
    },

    // Book Details
    publicationYear: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear() + 1
    },
    edition: {
        type: String,
        trim: true
    },
    format: {
        type: String,
        enum: ['paperback', 'hardcover', 'ebook', 'audiobook'],
        default: 'paperback'
    },
    pages: {
        type: Number,
        min: 1
    },
    language: {
        type: String,
        default: 'English'
    },

    // Pricing & Inventory
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },

    // Descriptive Information
    description: {
        type: String,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true
    },

    // Book Metadata
    dimensions: {
        height: Number, // in cm or inches
        width: Number,
        thickness: Number
    },
    weight: {
        type: Number, // in grams or ounces
        min: 0
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true
    });

bookSchema.index({ title: 'text', author: 'text', genre: 'text', publisher: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ isActive: 1 });

export const bookModel = model('Book', bookSchema);
