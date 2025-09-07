import { model, Schema } from "mongoose";


const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ['user', 'admin']
        },
        isConfirmed: {
            type: Boolean,
            default: false
        },
        phone: {
            type: String,
            trim: true
        },
        addresses: [{
            _id: {
                type: Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId(),
                required: true
            },
            street: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                trim: true
            },
            state: {
                type: String,
                trim: true
            },
            zipCode: {
                type: String,
                trim: true
            },
            country: {
                type: String,
                trim: true
            },
            isDefault: { type: Boolean, default: false }
        }],
        wishlist: [{
            type: Schema.Types.ObjectId,
            ref: 'Book'
        }],
        cart: {
            items: [
                {
                    bookId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Book',
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        default: 1,
                        min: 1
                    },
                    name: String,
                    price: Number,
                    image: String
                }
            ],
            total: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true, // createdAt, updatedAt
        versionKey: false // exclude --v
    }
)


export const userModel = model('User', userSchema)
