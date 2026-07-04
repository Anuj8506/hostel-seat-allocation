const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Student.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({ message: 'Not authorized, admin only' });
    }
};

module.exports = { protect, adminOnly };