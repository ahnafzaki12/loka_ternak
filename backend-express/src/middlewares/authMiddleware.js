const { verifyToken } = require('../utils/jwt');

const getCookieValue = (req, name) => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const cookie = cookies.find((item) => item.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null;
};

const authMiddleware = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;
        const token = getCookieValue(req, 'token') || bearerToken;

        if (!token) {
            return res.status(401).json({ message: 'Token tidak ditemukan' });
        }

        req.user = verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    authorizeRoles,
};
