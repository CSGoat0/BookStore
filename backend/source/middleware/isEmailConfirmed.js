import { userModel } from "../../database/models/userModel.js";

export const isEmailConfirmed = async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
    }
    else if (user.isConfirmed) {
        next();
    } else {
        res.status(403).json({ message: "Email not confirmed" });
    }
};
