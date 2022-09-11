import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routers/index';
import { errorHandler } from './middlewares/ErrorHandler';

dotenv.config();

const PORT: number = parseInt(process.env.PORT || "3333");
const DB_URL: string = process.env.DB_URL || "";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,  
}));
app.use("/api", router);
app.use(errorHandler);

async function connectDB(DB_URL: string) {
    try {
        await mongoose.connect(DB_URL);
        console.log("Successfully connected to DB");
    } catch(err) {
        console.log(`Unable to connect to DB, error: ${err}`);
    }
} connectDB(DB_URL);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));