import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './configs/env.config.js';
import startDb from './configs/db.config.js'; 
import mainRouter from './routes/main.route.js';  
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'))
app.use('/api/v1', mainRouter);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    startDb();
    console.log(`Server running on port ${PORT}`);
});
