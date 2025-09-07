import jwt from "jsonwebtoken";

export const checkHeaderToken = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    token = token.trim();
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }
    jwt.verify(token, "NTIBookStore2025", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};
