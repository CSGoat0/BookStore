import bcrypt from 'bcrypt';

export const hashPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        res.status(500).json({ message: "Error hashing password" });
    }
};