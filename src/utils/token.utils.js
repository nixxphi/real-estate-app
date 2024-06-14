import jwt from 'jsonwebtoken';
import  { JWT_SECRET } from '../configs/env.config.js'

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
    const decoded = jwt.decode(token)
    if (!decoded) throw new Error('Invalid token.')

    if (new Date(decoded?.exp * 1000) <= new Date()) throw new Error('Session expired. Login to conitinue.')
        
    return jwt.verify(token, JWT_SECRET);
};

export const getUserIdFromToken = (token) => {
    if (token.startsWith('Bearer ')) {
        console.log('token:', token);
        token = token.slice(7, token.length).trimLeft();
    }

    const decoded = verifyToken;
    console.log('decoded:', decoded);
    return decoded.userId && decoded;
};

export default { generateToken, verifyToken, getUserIdFromToken };