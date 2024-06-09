import express from 'express';
import { PORT } from './configs/env.config.js';
import startDb from './configs/db.config.js'; 
import mainRouter from './routes/main.route.js';  
import { createError, ERROR_CODES } from './utils/error.utils.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRouter);

app.use((req, res, next) => {
    next(createError(ERROR_CODES.NOT_FOUND, 'Endpoint not found'));
});

app.use((err, req, res, next) => {
    res.status(err.code || ERROR_CODES.INTERNAL_ERROR).json({ error: err.message });
});

startDb();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
