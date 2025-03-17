import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: true }));

import authRoutes from './routes/auth.routes.js';
import tradeRoutes from './routes/trade.routes.js';
import incentivesRoutes from "./routes/incentives.routes.js"
import userRoutes from "./routes/user.routes.js"
import mintRoutes from "./routes/mint.routes.js";

app.use('/api/auth', authRoutes);
app.use('/api/carbon', tradeRoutes);
app.use("/api/incentives", incentivesRoutes)
app.use("/api/user", userRoutes)

app.use('/api', mintRoutes);  // Mount the mint routes



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
