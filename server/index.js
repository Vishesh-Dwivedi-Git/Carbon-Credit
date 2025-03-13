import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
dotenv.config();

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true }));


import authRoutes from './routes/auth.routes.js';
import tradeRoutes from './routes/trade.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/carbon', tradeRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

app.listen(port, () => {
    connectDB();
    console.log(`Server is running at port ${port}`);
});
