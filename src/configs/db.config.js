import mongoose from 'mongoose';
import { MONGODB_URI as uri, DB_NAME as dbName } from './env.config.js';
import { createError, ERROR_CODES } from '../utils/error.utils.js';

let isConnecting = false;

export default () => {
 const startdb = async () => {
  mongoose.set('strictQuery', false);
  isConnecting = true;

  try {
   mongoose.connect(uri, { dbName });
   console.log('Database connection successful');
   isConnecting = false;
  } catch (err) {
   console.error(err);
   throw createError(ERROR_CODES.DATABASE_ERROR, 'There was an error connecting to database');
  } finally {
   isConnecting = false;
  }
 };

 startdb();

 process.on('uncaughtException', async (err) => {
  if (err instanceof mongoose.Error && err.name === 'MongoServerError' && !isConnecting) {
   console.error('Database connection error. Retrying...');
   await startdb();
  } else {
   console.error('Uncaught exception:', err);
   process.exit(1);
  }
 });
}