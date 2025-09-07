import { userModel } from "../../../database/models/userModel.js";

const getAddresses = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id);
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAddress = async (req, res) => {
    const { id } = req.params;
    const newAddress = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $push: { addresses: { ...newAddress, isDefault: false } } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { addressId, ...updates } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $set: { "addresses.$[elem]": updates } },
            {
                arrayFilters: [{ "elem._id": addressId }],
                new: true
            }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeAddress = async (req, res) => {
    const { id } = req.params;
    const { addressId } = req.body;

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        );
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const setDefaultAddress = async (req, res) => {
    const { id } = req.params;
    const { addressId } = req.body;

    try {
        // First: Set ALL addresses to isDefault: false
        await userModel.findByIdAndUpdate(
            id,
            { $set: { "addresses.$[].isDefault": false } }
        );

        // Second: Set the specific address to isDefault: true
        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $set: { "addresses.$[elem].isDefault": true } },
            {
                arrayFilters: [{ "elem._id": addressId }],
                new: true
            }
        );

        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export { addAddress, updateAddress, removeAddress, getAddresses, setDefaultAddress };