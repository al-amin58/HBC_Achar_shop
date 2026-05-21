import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

// ── admin এর email আর password ──
const ADMIN_EMAIL    = 'admin@admin.com';
const ADMIN_PASSWORD = '123456789';
// const ROLE = 'admin';
const ADMIN_NAME     = 'Admin User';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    
    // আগে admin আছে কিনা check করো
    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log('Admin already exists. Skipping seed.');
      process.exit(0);
    }

    // password hash করে 
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ 
      name: ADMIN_NAME,
      email: ADMIN_EMAIL, 
      password: hashed 
    });
    console.log('Admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();