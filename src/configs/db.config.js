import mongoose from 'mongoose';
import { MONGODB_URI, DB_NAME as dbName } from './env.config.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

export default (function database() {
  const startdb = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(MONGODB_URI, {
        dbName,
      })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        throw createError(ERROR_CODES.DATABASE_ERROR, 'There was an error connecting to database');
        console.error('There was an error connecting to database:', err.message);
        console.log('Reconnecting to database...');
        startdb();
      });
  };

  startdb();
});