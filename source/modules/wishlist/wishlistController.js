import { userModel } from "../../../database/models/userModel.js";

// Add to wishlist
const addToWishlist = async (req, res) => {
    const { id } = req.params;
    const { bookId } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $addToSet: { wishlist: bookId } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    const { id } = req.params;
    const { bookId } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $pull: { wishlist: bookId } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get wishlist
const getWishlist = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $set: { wishlist: [] } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { addToWishlist, removeFromWishlist, getWishlist, clearWishlist };