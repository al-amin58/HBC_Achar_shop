import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

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
app.use('/api/auth', authRoutes);  

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

connectDB();

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});