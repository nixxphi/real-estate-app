import dotenv from 'dotenv';
dotenv.config();

export const DB_NAME = process.env.DB_NAME;
export const MONGODB_URI = process.env.MONGODB_URI
export const DB_DIALECT = process.env.DB_DIALECT;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;