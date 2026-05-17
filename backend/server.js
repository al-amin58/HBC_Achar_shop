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
import ProductRoutes from "./routes/productRoutes.js";
import CustomerRoutes from "./routes/customers.js";
import SettingsRoutes from "./routes/settingsRoutes.js";
import HomeRoutes from "./routes/homeRoutes.js";
import CartRoutes from "./routes/cartRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";


dotenv.config();

const app = express();

const isAllowedOrigin = (origin) => {
  try {
    const u = new URL(origin);
    return u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1");
  } catch {
    return false;
  }
};

app.use(cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(helmet());

app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subcategories', SubCategoryRoutes);
app.use('/api/product-attributes', ProductAttributeRoutes);
app.use('/api/product-variations', ProductVariationRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/settings', SettingsRoutes);
app.use('/api/home', HomeRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/orders', OrderRoutes);

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
