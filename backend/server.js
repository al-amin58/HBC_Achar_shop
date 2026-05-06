import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoute.js';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(helmet());


// all routes related to authentication will be prefixed with  
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/auth', authRoutes);  


connectDB();

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});