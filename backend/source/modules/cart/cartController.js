import { bookModel } from "../../../database/models/bookModel.js";
import { userModel } from "../../../database/models/userModel.js";

// Get user's cart
const getCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('cart.items.bookId');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            cart: user.cart
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { bookId, quantity = 1 } = req.body;
        const userId = req.params.id;

        // Find the book
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if item already exists in cart
        const existingItemIndex = user.cart.items.findIndex(
            item => item.bookId.toString() === bookId
        );

        if (existingItemIndex >= 0) {
            // Update quantity if item exists
            user.cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            user.cart.items.push({
                bookId: book._id,
                quantity: quantity,
                name: book.title,
                price: book.price,
                image: book.coverImage
            });
        }

        // Recalculate total
        user.cart.total = user.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await user.save();

        res.json({
            success: true,
            message: "Item added to cart",
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const { bookId, quantity } = req.body;
        const userId = req.params.id;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Find the book to check stock
        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // Find the user and update cart
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const itemIndex = user.cart.items.findIndex(
            item => item.bookId.toString() === bookId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        user.cart.items[itemIndex].quantity = quantity;

        // Recalculate total
        user.cart.total = user.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await user.save();

        res.json({
            success: true,
            message: "Cart updated",
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out the item to remove
        user.cart.items = user.cart.items.filter(
            item => item.bookId.toString() !== bookId
        );

        // Recalculate total
        user.cart.total = user.cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        await user.save();

        res.json({
            success: true,
            message: "Item removed from cart",
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.cart = { items: [], total: 0 };
        await user.save();

        res.json({
            success: true,
            message: "Cart cleared",
            cart: user.cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart count (for displaying in UI)
const getCartCount = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const itemCount = user.cart.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        res.json({
            success: true,
            count: itemCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount
};