import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['recharge', 'purchase', 'refund', 'cashback', 'deduct', 'admin'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    reference: { type: String, default: '' },
    balanceAfter: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

const rewardTransactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['earned', 'redeemed', 'referral', 'admin', 'expired'], required: true },
    points: { type: Number, required: true },
    description: { type: String, default: '' },
    reference: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        sparse: true,
    },  
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        sparse: true,
    },  
    status: {
        type: String,
        enum: ['Active', 'Blocked'],
        default: 'Active'
    },
    location: {
        type: String,
        default: 'Dhaka'
    },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpend:  { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    walletTransactions: { type: [walletTransactionSchema], default: [] },
    rewardPoints: { type: Number, default: 0 },
    rewardTransactions: { type: [rewardTransactionSchema], default: [] },
    landingPages: { type: Number, default: 0 },
    resetOtp:{
         type: String,
          default: null 
    },
    resetOtpExpires: { 
        type: Date,   
        default: null 
    },

}, {
    timestamps: true
});

export default mongoose.model('User', userSchema);

 
