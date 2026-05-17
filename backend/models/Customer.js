import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const walletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['recharge', 'purchase', 'refund', 'cashback', 'deduct', 'admin'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  reference: { type: String },
  balanceAfter: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const rewardTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['earned', 'redeemed', 'referral', 'admin', 'expired'], required: true },
  points: { type: Number, required: true },
  description: { type: String },
  reference: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const customerSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:    { type: String, trim: true },
  password: { type: String, required: true },
  location: { type: String, default: 'Dhaka' },
  avatar:   { type: String, default: '' },

  // Membership
  level:  { type: String, enum: ['Bronze','Silver','Gold','Platinum','VIP'], default: 'Bronze' },
  status: { type: String, enum: ['Active','Blocked'], default: 'Active' },

  // Stats
  totalOrders: { type: Number, default: 0 },
  totalSpend:  { type: Number, default: 0 },

  // Wallet
  walletBalance: { type: Number, default: 0 },
  walletTransactions: [walletTransactionSchema],

  // Rewards
  rewardPoints: { type: Number, default: 0 },
  rewardTransactions: [rewardTransactionSchema],

  // Landing pages count
  landingPages: { type: Number, default: 0 },

  lastLogin: { type: Date },
}, { timestamps: true });

// Auto-compute membership level based on totalSpend
customerSchema.methods.computeLevel = function () {
  const s = this.totalSpend;
  if (s >= 100000) this.level = 'VIP';
  else if (s >= 50000) this.level = 'Platinum';
  else if (s >= 15000) this.level = 'Gold';
  else if (s >= 5000)  this.level = 'Silver';
  else                 this.level = 'Bronze';
};

customerSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.computeLevel();
});


customerSchema.methods.comparePassword = function (p) {
  return bcrypt.compare(p, this.password);
};

// Sanitize output
customerSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('Customer', customerSchema);
