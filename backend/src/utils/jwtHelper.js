const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'emotiweb_secret_2026';
const JWT_EXPIRES_IN = '7d';

class JwtHelper {
    static generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    static decodeToken(token) {
        return jwt.decode(token);
    }
}

module.exports = JwtHelper;
