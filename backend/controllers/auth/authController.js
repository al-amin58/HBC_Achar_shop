import User from '../../models/User.js';
import Order from '../../models/Order.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

// Signup user
export const signupUser = async (req, res) => {
    try{

        const { name, phonenumber, password, confirmPassword  } = req.body;

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "Name is required (min 3 chars)" });
        }
        const phoneRegex = /^01[0-9]{9}$/;
            if (!phonenumber || !phoneRegex.test(phonenumber)) {
                return res.status(400).json({
                message: "Phone must be 11 digits and start with 01"
            });
        }
        
        if (!password || password.length < 8 || password.length > 12) {
            return res.status(400).json({
                message: "Password must be 8-12 characters"
            });
        }

        if (password !== req.body.confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        //  XSS protection (basic)
        if (!validator.isAlphanumeric(name.replace(/\s/g, ''))) {
            return res.status(400).json({
                message: "Invalid characters in name"
            });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ phonenumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Already registered with this phone number' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        await User.create({
            name: name.trim(),
            phonenumber,
            password: hashedPassword
        });

        res.json({ message: 'User created successfully !' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}   

// Login user
export const loginUser = async (req, res) => {
    try{
        const { phonenumber, password } = req.body;

        if (!phonenumber || !password) {
            return res.status(400).json({ message: 'Phone number and password are required' });
        }

         // Check if user  exists
        const user = await User.findOne({ phonenumber });
        if (!user) {
            return res.status(400).json({ message: 'Please register or enter correct phone number.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Enter your correct password.' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id },
             process.env.JWT_SECRET, 
             { expiresIn: '7d' }
        );

        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                phonenumber: user.phonenumber
            }, 
            message: 'Login successful' 
            
        });

    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/** GET /api/auth/me — logged-in customer profile */
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    const totalOrders = await Order.countDocuments({ user: user._id });
    const recentOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('orderNumber status pricing.total createdAt monthlySubscription items')
      .lean();

    return res.json({
      user: {
        id: String(user._id),
        name: user.name,
        phonenumber: user.phonenumber,
        email: user.email || '',
        location: user.location || 'Dhaka',
        totalOrders: user.totalOrders ?? totalOrders,
        totalSpend: user.totalSpend ?? 0,
      },
      stats: { totalOrders },
      recentOrders: recentOrders.map((o) => ({
        id: String(o._id),
        orderNumber: o.orderNumber,
        status: o.status,
        total: o.pricing?.total ?? 0,
        itemCount: (o.items || []).reduce((s, i) => s + (i.qty || 0), 0),
        monthlySubscription: Boolean(o.monthlySubscription),
        createdAt: o.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load profile', error: error.message });
  }
};

//logout user (handled in route by clearing cookie)

export const logoutUser = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

// forget password, reset password, etc. can be added here in the future

/*  generate 4-digit OTP */
const generateOtp = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let otp = '';
  for (let i = 0; i < 9; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
};

/* STEP 1 — POST /auth/forgot-password/send-otp*/
export const sendOtp = async (req, res) => {
  try {
    const { phonenumber } = req.body;

    if (!phonenumber) {
      return res.status(400).json({ message: 'Phone number is required.' });
    }

    // ১. User আছে কিনা check
    const user = await User.findOne({ phonenumber });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this phone number.' });
    }

    // ২. OTP generate করো এবং 5 মিনিটের expiry  
    const otpCode = generateOtp();
    const expiry  = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ৩. User এর নিজের document এ save 
    user.resetOtp        = otpCode;
    user.resetOtpExpires = expiry;
    await user.save();

    // Real project এ এখানে SMS gateway দিয়ে OTP পাঠাবে
    console.log(`[OTP] ${phonenumber} → ${otpCode}`);

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('sendOtp error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* STEP 2 — POST /auth/forgot-password/verify-otp*/
export const verifyOtp = async (req, res) => {
  try {
    const { phonenumber, otp } = req.body;

    if (!phonenumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required.' });
    }

    const user = await User.findOne({ phonenumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // ১. OTP আছে কিনা
    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // ২. Expired কিনা check
    if (user.resetOtpExpires < new Date()) {
      user.resetOtp        = null;
      user.resetOtpExpires = null;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    // ৩. OTP match check
    if (user.resetOtp !== otp.toString().toUpperCase()) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    return res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('verifyOtp error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* STEP 3 — POST /auth/forgot-password/reset */
export const resetPassword = async (req, res) => {
  try {
    const { phonenumber, otp, newPassword } = req.body;

    if (!phonenumber || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ phonenumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // ১. OTP আবার verify
    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No OTP found. Please start again.' });
    }

    if (user.resetOtpExpires < new Date()) {
      user.resetOtp        = null;
      user.resetOtpExpires = null;
      await user.save();
      return res.status(400).json({ message: 'OTP expired. Please start again.' });
    }

    if (user.resetOtp !== otp.toString().toUpperCase()) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // ২. নতুন password hash করে save করো
    user.password        = await bcrypt.hash(newPassword, 10);

    // ৩. OTP fields clear করো
    user.resetOtp        = null;
    user.resetOtpExpires = null;

    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};