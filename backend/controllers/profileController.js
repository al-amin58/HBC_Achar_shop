import User from '../models/User.js';
import LandingRequest from '../models/LandingRequest.js';
import Order from '../models/Order.js';

const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const formatAddress = (addr) => ({
  id: String(addr._id),
  label: addr.label || '',
  address: addr.address || '',
  area: addr.area || '',
  division: addr.division || '',
  district: addr.district || '',
  thana: addr.thana || '',
  divName: addr.divisionName || '',
  distName: addr.districtName || '',
  thanaName: addr.thanaName || '',
  isDefault: Boolean(addr.isDefault),
});

const formatWishlistItem = (item) => ({
  id: String(item._id),
  productId: item.productId,
  name: item.name,
  image: item.image || '',
  price: item.price || 0,
  variation: item.variation || '',
  stock: item.stock ?? 0,
  rating: item.rating ?? 0,
});

const formatNotification = (n) => ({
  id: String(n._id),
  type: n.type || 'order',
  title: n.title,
  body: n.body || '',
  read: Boolean(n.read),
  date: n.createdAt,
});

const formatTicket = (t) => ({
  id: `TK-${String(t._id).slice(-6).toUpperCase()}`,
  _id: String(t._id),
  subject: t.subject,
  description: t.description || '',
  category: t.category || 'Other',
  status: t.status || 'open',
  date: t.createdAt,
});

const mapLandingStatus = (status) => {
  const map = {
    Pending: 'pending',
    'Under Review': 'pending',
    Approved: 'approved',
    Published: 'approved',
    Rejected: 'rejected',
  };
  return map[status] || 'pending';
};

const formatLanding = (r) => ({
  id: String(r._id),
  name: r.title,
  product: r.products ? `${r.products} পণ্য` : '—',
  theme: r.template || 'Grid',
  status: mapLandingStatus(r.status),
  date: r.createdAt,
  adminNote: r.adminNote || '',
});

const mapWalletTx = (tx) => {
  const creditTypes = new Set(['recharge', 'refund', 'cashback', 'admin']);
  const isCredit = creditTypes.has(tx.type) && Number(tx.amount) >= 0;
  return {
    id: String(tx._id || `${tx.createdAt}-${tx.amount}`),
    type: isCredit ? 'credit' : 'debit',
    label: tx.description || tx.type,
    amount: Math.abs(Number(tx.amount) || 0),
    date: tx.createdAt,
  };
};

/** GET /api/profile/wallet */
export const getMyWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const txs = (user.walletTransactions || []).map(mapWalletTx);
    txs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const start = monthStart();
    let addedThisMonth = 0;
    let spentThisMonth = 0;
    for (const tx of user.walletTransactions || []) {
      const dt = tx.createdAt ? new Date(tx.createdAt) : null;
      if (!dt || dt < start) continue;
      const amt = Math.abs(Number(tx.amount) || 0);
      if (['recharge', 'refund', 'cashback', 'admin'].includes(tx.type) && Number(tx.amount) >= 0) {
        addedThisMonth += amt;
      } else {
        spentThisMonth += amt;
      }
    }

    const cashback = (user.walletTransactions || [])
      .filter((t) => t.type === 'cashback')
      .reduce((s, t) => s + Math.abs(Number(t.amount) || 0), 0);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chart = days.map((day, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayTxs = (user.walletTransactions || []).filter((t) => {
        const td = t.createdAt ? new Date(t.createdAt) : null;
        return td && td.toDateString() === d.toDateString();
      });
      const balance = Number(user.walletBalance) || 0;
      return { day, balance: dayTxs.length ? balance : Math.max(0, balance - (6 - i) * 50) };
    });

    return res.json({
      balance: Number(user.walletBalance) || 0,
      cashback,
      addedThisMonth,
      spentThisMonth,
      pendingWithdraw: 0,
      transactions: txs,
      chart,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/addresses */
export const getMyAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((!user.addresses || user.addresses.length === 0) && user.shippingAddress?.address) {
      user.addresses.push({
        label: 'প্রাথমিক',
        address: user.shippingAddress.address,
        division: user.shippingAddress.division || '',
        district: user.shippingAddress.district || '',
        thana: user.shippingAddress.thana || '',
        isDefault: true,
      });
      await user.save();
    }

    return res.json((user.addresses || []).map(formatAddress));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/profile/addresses */
export const addAddress = async (req, res) => {
  try {
    const {
      label, address, area, division, district, thana,
      divName, distName, thanaName,
    } = req.body;
    if (!label?.trim() || !address?.trim()) {
      return res.status(400).json({ message: 'লেবেল ও ঠিকানা প্রয়োজন' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFirst = !user.addresses?.length;
    if (isFirst) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    user.addresses.push({
      label: label.trim(),
      address: address.trim(),
      area: area?.trim() || '',
      division: division || '',
      district: district || '',
      thana: thana || '',
      divisionName: divName || '',
      districtName: distName || '',
      thanaName: thanaName || '',
      isDefault: isFirst || Boolean(req.body.isDefault),
    });

    if (user.addresses[user.addresses.length - 1].isDefault) {
      user.shippingAddress = {
        address: address.trim(),
        division: division || '',
        district: district || '',
        thana: thana || '',
      };
    }

    await user.save();
    const added = user.addresses[user.addresses.length - 1];
    return res.status(201).json(formatAddress(added));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** PUT /api/profile/addresses/:id */
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: 'ঠিকানা পাওয়া যায়নি' });

    const {
      label, address, area, division, district, thana,
      divName, distName, thanaName,
    } = req.body;
    if (label) addr.label = label.trim();
    if (address) addr.address = address.trim();
    if (area !== undefined) addr.area = area?.trim() || '';
    if (division !== undefined) addr.division = division;
    if (district !== undefined) addr.district = district;
    if (thana !== undefined) addr.thana = thana;
    if (divName !== undefined) addr.divisionName = divName || '';
    if (distName !== undefined) addr.districtName = distName || '';
    if (thanaName !== undefined) addr.thanaName = thanaName || '';

    if (addr.isDefault) {
      user.shippingAddress = {
        address: addr.address,
        division: addr.division,
        district: addr.district,
        thana: addr.thana,
      };
    }

    await user.save();
    return res.json(formatAddress(addr));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** DELETE /api/profile/addresses/:id */
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: 'ঠিকানা পাওয়া যায়নি' });

    const wasDefault = addr.isDefault;
    addr.deleteOne();
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
      const a = user.addresses[0];
      user.shippingAddress = { address: a.address, division: a.division, district: a.district, thana: a.thana };
    }

    await user.save();
    return res.json({ message: 'ঠিকানা মুছে ফেলা হয়েছে' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** PATCH /api/profile/addresses/:id/default */
export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ message: 'ঠিকানা পাওয়া যায়নি' });

    user.addresses.forEach((a) => { a.isDefault = false; });
    addr.isDefault = true;
    user.shippingAddress = {
      address: addr.address,
      division: addr.division,
      district: addr.district,
      thana: addr.thana,
    };

    await user.save();
    return res.json((user.addresses || []).map(formatAddress));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/wishlist */
export const getMyWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json((user.wishlist || []).map(formatWishlistItem));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/profile/wishlist */
export const addToWishlist = async (req, res) => {
  try {
    const { productId, name, image, price, variation, variationId, stock, rating } = req.body;
    if (!productId || !name) {
      return res.status(400).json({ message: 'productId ও name প্রয়োজন' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const exists = user.wishlist.find((w) => w.productId === String(productId));
    if (exists) return res.status(400).json({ message: 'ইতিমধ্যে উইশলিস্টে আছে' });

    user.wishlist.push({
      productId: String(productId),
      name: String(name).trim(),
      image: image || '',
      price: Number(price) || 0,
      variation: variation || '',
      variationId: variationId || null,
      stock: Number(stock) || 0,
      rating: Number(rating) || 0,
    });

    await user.save();
    const added = user.wishlist[user.wishlist.length - 1];
    return res.status(201).json(formatWishlistItem(added));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** DELETE /api/profile/wishlist/:id */
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.wishlist.id(req.params.id);
    if (!item) return res.status(404).json({ message: 'আইটেম পাওয়া যায়নি' });

    item.deleteOne();
    await user.save();
    return res.json({ message: 'উইশলিস্ট থেকে সরানো হয়েছে' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/notifications */
export const getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    let items = user.notifications || [];
    if (items.length === 0) {
      const recentOrders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
      items = recentOrders.map((o) => ({
        type: 'order',
        title: `অর্ডার ${o.orderNumber}`,
        body: `স্ট্যাটাস: ${o.status}`,
        read: false,
        createdAt: o.createdAt,
        _id: o._id,
      }));
    }

    return res.json(items.map(formatNotification));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** PATCH /api/profile/notifications/:id/read */
export const markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const notif = user.notifications.id(req.params.id);
    if (!notif) return res.status(404).json({ message: 'নোটিফিকেশন পাওয়া যায়নি' });

    notif.read = true;
    await user.save();
    return res.json(formatNotification(notif));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** PATCH /api/profile/notifications/read-all */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.notifications.forEach((n) => { n.read = true; });
    await user.save();
    return res.json({ message: 'সব পড়া হয়েছে' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** PUT /api/profile/notification-settings */
export const updateNotificationSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const keys = ['order', 'wallet', 'flash', 'landing'];
    for (const k of keys) {
      if (req.body[k] !== undefined) {
        user.notificationSettings[k] = Boolean(req.body[k]);
      }
    }

    await user.save();
    return res.json(user.notificationSettings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/landing-requests */
export const getMyLandingRequests = async (req, res) => {
  try {
    const reqs = await LandingRequest.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(reqs.map(formatLanding));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/profile/landing-requests */
export const createMyLandingRequest = async (req, res) => {
  try {
    const name = String(req.body.name || req.body.title || '').trim();
    const product = String(req.body.product || '').trim();
    const theme = String(req.body.theme || req.body.template || 'Modern').trim();
    const message = String(req.body.message || '').trim();

    if (!name) return res.status(400).json({ message: 'পেজের নাম প্রয়োজন' });

    const created = await LandingRequest.create({
      customerId: req.user._id,
      title: name,
      products: product ? 1 : 0,
      template: theme,
      status: 'Pending',
      adminNote: message,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { landingPages: 1 } });

    return res.status(201).json(formatLanding(created.toObject()));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/support-tickets */
export const getMySupportTickets = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json((user.supportTickets || []).map(formatTicket));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** POST /api/profile/support-tickets */
export const createSupportTicket = async (req, res) => {
  try {
    const { subject, description, category } = req.body;
    if (!subject?.trim()) return res.status(400).json({ message: 'বিষয় প্রয়োজন' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.supportTickets.push({
      subject: subject.trim(),
      description: description?.trim() || '',
      category: category || 'Other',
      status: 'open',
    });

    await user.save();
    const ticket = user.supportTickets[user.supportTickets.length - 1];
    return res.status(201).json(formatTicket(ticket));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** GET /api/profile/devices */
export const getMyDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const devices = (user.loginDevices || [])
      .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
      .map((d) => ({
        id: String(d._id),
        name: d.name || 'Unknown device',
        ip: d.ip || '',
        date: d.lastActive,
        current: Boolean(d.isCurrent),
      }));

    return res.json(devices);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/** DELETE /api/profile/devices/:id */
export const removeDevice = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const device = user.loginDevices.id(req.params.id);
    if (!device) return res.status(404).json({ message: 'ডিভাইস পাওয়া যায়নি' });
    if (device.isCurrent) {
      return res.status(400).json({ message: 'বর্তমান ডিভাইস সরানো যাবে না' });
    }

    device.deleteOne();
    await user.save();
    return res.json({ message: 'ডিভাইস সরানো হয়েছে' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
