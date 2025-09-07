import { userModel } from "../../database/models/userModel.js"

export const isEmailExist = async (req, res, next) => {
    const exist = await userModel.findOne({ email: req.body.email })
    if (exist) return res.status(409).json({ message: "user already registered, please login" })
    next();
}