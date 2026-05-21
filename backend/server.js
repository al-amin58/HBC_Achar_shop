import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
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
import ProductPublicRoutes from "./routes/productPublicRoutes.js";
import CartRoutes from "./routes/cartRoutes.js";
import OrderRoutes from "./routes/orderRoutes.js";
import CouponRoutes from "./routes/couponRoutes.js";
import ProfileRoutes from "./routes/profileRoutes.js";
import AdminOrderRoutes from "./routes/adminOrderRoutes.js";
import AdminCourierRoutes from "./routes/adminCourierRoutes.js";
import TrackOrderRoutes from "./routes/trackOrderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { createNotification } from './controllers/notificationController.js';


dotenv.config();

const app = express();
const httpServer = createServer(app);

const isAllowedOrigin = (origin) => {
  try {
    const u = new URL(origin);
    return u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1");
  } catch {
    return false;
  }
};

const corsOptions = {
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({limit: "20mb"}));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(helmet());

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/subcategories', SubCategoryRoutes);
app.use('/api/product-attributes', ProductAttributeRoutes);
app.use('/api/product-variations', ProductVariationRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/customers', CustomerRoutes);
app.use('/api/settings', SettingsRoutes);
app.use('/api/home', HomeRoutes);
app.use('/api/product', ProductPublicRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/coupons', CouponRoutes);
app.use('/api/profile', ProfileRoutes);
app.use('/api/admin/orders', AdminOrderRoutes);
app.use('/api/admin/couriers', AdminCourierRoutes);
app.use('/api/track', TrackOrderRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('/api/auth', authRoutes);

const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  if (globalThis.__hbcServer) {
    console.log(`Server already running on port ${PORT}`);
    return;
  }

  const isDbConnected = await connectDB();
  if (!isDbConnected) {
    process.exit(1);
  }

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('join_admin', () => {
      socket.join('admin_room');
      console.log('Admin joined admin room');
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer.listen(PORT, () => {
    globalThis.__hbcServer = httpServer;
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Socket.io server is running");
    console.log("Notification API: /api/notifications");
    console.log("Coupon API: /api/coupons");
    console.log("Admin Orders API: /api/admin/orders");
    console.log("Admin Couriers API: /api/admin/couriers");
    console.log("Product API: /api/home/product/:id");
  });

  httpServer.once("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\nPort ${PORT} is already in use — another backend is still running.`);
      console.error("Fix (run once in the backend folder):");
      console.error("  npm run stop");
      console.error("Then start again:");
      console.error("  node server.js");
      console.error("\nOr close the other terminal where node server.js / npm run dev is running.\n");
    } else {
      console.error(err);
    }
    process.exit(1);
  });
};

startServer();

export { io, createNotification };
