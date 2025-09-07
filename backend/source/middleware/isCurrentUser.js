import jwt from 'jsonwebtoken';

export const isCurrentUser = (req, res, next) => {
    const userId = jwt.verify(req.headers['authorization'], "NTIBookStore2025").id;
    const paramId = req.params.id;
    if (userId !== paramId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};