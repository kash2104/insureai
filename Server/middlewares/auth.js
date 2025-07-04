require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access. No token provided.',
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            next();
        } 
        catch (error) {
            console.error('Authentication error:', error);
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please log in again.',
            });
        }
                
    } catch (error) {
       return res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please log in.',
            error: error.message,
       }) 
    }
}