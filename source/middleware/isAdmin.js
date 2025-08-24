import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
    let token = req.headers['authorization'].trim();
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    if (token.startsWith("Bearer ")) {
        token = token.slice(7); // Remove "Bearer " (7 characters)
    }
    jwt.verify(token, "NTIBookStore2025", (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        if (user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Forbidden' });
        }
    });
};