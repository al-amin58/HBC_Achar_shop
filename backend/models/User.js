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

const addressSchema = new mongoose.Schema({
    label: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    area: { type: String, default: '' },
    division: { type: String, default: '' },
    district: { type: String, default: '' },
    thana: { type: String, default: '' },
    divisionName: { type: String, default: '' },
    districtName: { type: String, default: '' },
    thanaName: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const wishlistItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
    variation: { type: String, default: '' },
    variationId: { type: String, default: null },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
    type: { type: String, enum: ['order', 'wallet', 'flash', 'lp'], default: 'order' },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    read: { type: Boolean, default: false },
}, { timestamps: true });

const supportTicketSchema = new mongoose.Schema({
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Other' },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
}, { timestamps: true });

const loginDeviceSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    lastActive: { type: Date, default: Date.now },
    isCurrent: { type: Boolean, default: false },
}, { timestamps: true });

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
    shippingAddress: {
        address: { type: String, default: '' },
        division: { type: String, default: '' },
        district: { type: String, default: '' },
        thana: { type: String, default: '' },
    },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    addresses: { type: [addressSchema], default: [] },
    wishlist: { type: [wishlistItemSchema], default: [] },
    notifications: { type: [notificationSchema], default: [] },
    notificationSettings: {
        order: { type: Boolean, default: true },
        wallet: { type: Boolean, default: true },
        flash: { type: Boolean, default: false },
        landing: { type: Boolean, default: true },
    },
    supportTickets: { type: [supportTicketSchema], default: [] },
    loginDevices: { type: [loginDeviceSchema], default: [] },
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

 
