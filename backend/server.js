import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoute.js';
import CategoryRoutes from "./routes/categoryRoutes.js";
import SubCategoryRoutes from "./routes/subCategoryRoutes.js";
import ProductAttributeRoutes from "./routes/productAttributeRoutes.js";
import ProductVariationRoutes from "./routes/productVariationRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(helmet());

app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subcategories', SubCategoryRoutes);
app.use('/api/product-attributes', ProductAttributeRoutes);
app.use('/api/product-variations', ProductVariationRoutes);
app.use('/api/auth', authRoutes);

const startServer = async () => {
  const isDbConnected = await connectDB();
  if (!isDbConnected) {
    process.exit(1);
  }

  app.listen(5001, () => {
    console.log("Server is running on port 5001");
  });
};

startServer();
