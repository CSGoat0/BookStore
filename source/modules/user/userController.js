import { userModel } from "../../../database/models/userModel.js";
import { sendMail } from "../../utilities/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = await userModel.create({ name: name, email: email, password: password, role: "user" });
        sendMail(email);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    let { email } = req.params
    jwt.verify(email, "NTIBookStore2025", async (err, decoded) => {
        if (err) return res.json({ message: "invalid token", err })
        await userModel.findOneAndUpdate({ email: decoded.email }, { isConfirmed: true })
        res.json({ message: "confirmed successfully" })
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, "NTIBookStore2025", { expiresIn: "1h" });
        res.json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    delete updateData.cart;
    delete updateData.wishlist;
    delete updateData.addresses;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, { ...req.body, role: "user" }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await userModel.findByIdAndDelete(id);
        res.status(200).json({ message: "deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const promoteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, { role: "admin" }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User promoted to admin", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const demoteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, { role: "user" }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User demoted to user", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getAllUsers, registerUser, verifyEmail, loginUser, updateUser, deleteUser, promoteUser, demoteUser };