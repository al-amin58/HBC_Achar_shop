import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {body, validationResult} from 'express-validator';
import Admin from '../../models/Admin.js';


export const adminLoginValidation  = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Invalid email format.')
    .normalizeEmail(),       
 
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
    .escape(),    
];


export const adminLogin = async (req, res) => {
  // validation error থাকলে এখানেই থামো
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // ১. Admin খোঁজো
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ২. Password check
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // ৩. 'admin' payload এ থাকবে
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile'
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update basic info
    if (name) admin.name = name;
    if (email) admin.email = email.toLowerCase().trim();

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'বর্তমান পাসওয়ার্ড সঠিক নয়'
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে'
        });
      }

      admin.password = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    // Generate new token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে'
    });
  }
};

