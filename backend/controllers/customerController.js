import mongoose from 'mongoose';
import User from '../models/User.js';
import LandingRequest from '../models/LandingRequest.js';

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const mapUserToCustomer = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email || '',
  phone: user.phonenumber,
  location: user.location || 'Dhaka',
  totalOrders: user.totalOrders || 0,
  totalSpend: user.totalSpend || 0,
  walletBalance: user.walletBalance || 0,
  rewardPoints: user.rewardPoints || 0,
  level: 'Bronze',
  status: user.status || 'Active',
  createdAt: user.createdAt,
  avatar: user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`,
});

// Get all customers (using User model as per registration)
export const getCustomers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    const customers = users.map(mapUserToCustomer);

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a customer (User)
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    // We only allow updating basic info or status if we add that field to User
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a customer (User)
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWalletSummary = async (_req, res) => {
  try {
    const users = await User.find({}, { walletBalance: 1, walletTransactions: 1 }).lean();
    const start = monthStart();
    let totalWalletBalance = 0;
    let cashbackThisMonth = 0;
    let refundsThisMonth = 0;

    for (const u of users) {
      totalWalletBalance += Number(u.walletBalance || 0);
      const txs = Array.isArray(u.walletTransactions) ? u.walletTransactions : [];
      for (const tx of txs) {
        const dt = tx.createdAt ? new Date(tx.createdAt) : null;
        if (!dt || dt < start) continue;
        if (tx.type === 'cashback') cashbackThisMonth += Math.abs(Number(tx.amount || 0));
        if (tx.type === 'refund') refundsThisMonth += Math.abs(Number(tx.amount || 0));
      }
    }

    return res.status(200).json({
      totalWalletBalance,
      cashbackThisMonth,
      refundsThisMonth,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRecentWalletTransactions = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const users = await User.find({}, { name: 1, image: 1, walletTransactions: 1 }).lean();
    const all = [];
    for (const u of users) {
      const txs = Array.isArray(u.walletTransactions) ? u.walletTransactions : [];
      for (const tx of txs) {
        all.push({
          userId: u._id,
          user: u.name,
          avatar: u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
          type: tx.type,
          amount: tx.amount,
          description: tx.description || '',
          date: tx.createdAt,
          status: 'Success',
        });
      }
    }
    all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return res.status(200).json(all.slice(0, limit));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adjustWalletBulk = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const action = String(req.body.action || '').toLowerCase();
    const amount = toNumber(req.body.amount);
    const reason = String(req.body.reason || '').trim();

    if (ids.length === 0) return res.status(400).json({ message: 'No customers selected.' });
    if (!['add', 'deduct'].includes(action)) return res.status(400).json({ message: 'Invalid action.' });
    if (amount == null || amount <= 0) return res.status(400).json({ message: 'Invalid amount.' });

    const users = await User.find({ _id: { $in: ids } });
    for (const user of users) {
      const current = Number(user.walletBalance || 0);
      const delta = action === 'add' ? amount : -amount;
      const next = current + delta;
      if (next < 0) return res.status(400).json({ message: 'Insufficient wallet balance for at least one customer.' });
      user.walletBalance = next;
      user.walletTransactions.push({
        type: action === 'add' ? 'admin' : 'deduct',
        amount: delta,
        description: reason,
        reference: 'admin',
        balanceAfter: next,
        createdAt: new Date(),
      });
      await user.save();
    }

    return res.status(200).json({ message: 'Wallet updated.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRewardsSummary = async (_req, res) => {
  try {
    const users = await User.find({}, { rewardPoints: 1, rewardTransactions: 1 }).lean();
    const start = monthStart();
    let totalRewardPoints = 0;
    let redeemedThisMonth = 0;
    let referralThisMonth = 0;

    for (const u of users) {
      totalRewardPoints += Number(u.rewardPoints || 0);
      const txs = Array.isArray(u.rewardTransactions) ? u.rewardTransactions : [];
      for (const tx of txs) {
        const dt = tx.createdAt ? new Date(tx.createdAt) : null;
        if (!dt || dt < start) continue;
        if (tx.type === 'redeemed') redeemedThisMonth += Math.abs(Number(tx.points || 0));
        if (tx.type === 'referral') referralThisMonth += Math.abs(Number(tx.points || 0));
      }
    }

    return res.status(200).json({
      totalRewardPoints,
      redeemedThisMonth,
      referralThisMonth,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getRecentRewardTransactions = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 20)));
    const users = await User.find({}, { name: 1, image: 1, rewardTransactions: 1 }).lean();
    const all = [];
    for (const u of users) {
      const txs = Array.isArray(u.rewardTransactions) ? u.rewardTransactions : [];
      for (const tx of txs) {
        all.push({
          userId: u._id,
          user: u.name,
          avatar: u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`,
          type: tx.type,
          points: tx.points,
          description: tx.description || '',
          date: tx.createdAt,
          status: 'Success',
        });
      }
    }
    all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return res.status(200).json(all.slice(0, limit));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adjustRewardsBulk = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const action = String(req.body.action || '').toLowerCase();
    const points = toNumber(req.body.points);
    const reason = String(req.body.reason || '').trim();

    if (ids.length === 0) return res.status(400).json({ message: 'No customers selected.' });
    if (!['add', 'remove'].includes(action)) return res.status(400).json({ message: 'Invalid action.' });
    if (points == null || points <= 0) return res.status(400).json({ message: 'Invalid points.' });

    const users = await User.find({ _id: { $in: ids } });
    for (const user of users) {
      const current = Number(user.rewardPoints || 0);
      const delta = action === 'add' ? points : -points;
      const next = current + delta;
      if (next < 0) return res.status(400).json({ message: 'Insufficient reward points for at least one customer.' });
      user.rewardPoints = next;
      user.rewardTransactions.push({
        type: action === 'add' ? 'admin' : 'redeemed',
        points: delta,
        description: reason,
        reference: 'admin',
        createdAt: new Date(),
      });
      await user.save();
    }

    return res.status(200).json({ message: 'Rewards updated.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLandingRequests = async (_req, res) => {
  try {
    const reqs = await LandingRequest.find()
      .populate('customerId', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    const out = reqs.map((r) => ({
      _id: r._id,
      customerId: r.customerId?._id || r.customerId,
      customer: r.customerId?.name || '',
      title: r.title,
      products: r.products || 0,
      template: r.template || 'Grid',
      date: r.createdAt,
      status: r.status,
    }));

    return res.status(200).json(out);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createLandingRequest = async (req, res) => {
  try {
    const customerId = req.body.customerId;
    const title = String(req.body.title || '').trim();
    const products = toNumber(req.body.products) ?? 0;
    const template = String(req.body.template || 'Grid').trim() || 'Grid';

    if (!customerId) return res.status(400).json({ message: 'customerId is required.' });
    if (!title) return res.status(400).json({ message: 'title is required.' });
    if (!mongoose.Types.ObjectId.isValid(String(customerId))) {
      return res.status(400).json({ message: 'Invalid customerId.' });
    }
    if (!Number.isFinite(products) || products < 0) {
      return res.status(400).json({ message: 'Invalid products.' });
    }

    const user = await User.findById(customerId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const created = await LandingRequest.create({
      customerId,
      title,
      products,
      template,
      status: 'Pending',
    });

    user.landingPages = Number(user.landingPages || 0) + 1;
    await user.save();

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateLandingRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const status = String(req.body.status || '').trim();
    const allowed = new Set(['Pending', 'Approved', 'Published', 'Under Review', 'Rejected']);
    if (!allowed.has(status)) return res.status(400).json({ message: 'Invalid status.' });

    const updated = await LandingRequest.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Request not found.' });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLandingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await LandingRequest.findById(id);
    if (!found) return res.status(404).json({ message: 'Request not found.' });

    await LandingRequest.findByIdAndDelete(id);
    const user = await User.findById(found.customerId);
    if (user) {
      user.landingPages = Math.max(0, Number(user.landingPages || 0) - 1);
      await user.save();
    }

    return res.status(200).json({ message: 'Request deleted.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
