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

