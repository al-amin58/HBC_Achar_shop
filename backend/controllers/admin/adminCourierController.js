import CourierSetting, {
  DEFAULT_COURIERS,
  slugifyCourierName,
} from '../../models/CourierSetting.js';
import { testCourierConnection } from '../../services/couriers/courierDispatcher.js';

const maskKey = (value) => {
  if (!value) return '';
  if (value.length <= 8) return '••••••••';
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
};

export const ensureDefaultCouriers = async () => {
  const count = await CourierSetting.countDocuments();
  if (count > 0) return;

  await CourierSetting.insertMany(
    DEFAULT_COURIERS.map((name) => ({
      name,
      slug: slugifyCourierName(name),
      isActive: false,
    }))
  );
};

const formatCourier = (doc, { includeSecrets = false } = {}) => ({
  id: String(doc._id),
  name: doc.name,
  slug: doc.slug,
  apiKey: includeSecrets ? doc.apiKey || '' : maskKey(doc.apiKey),
  secretKey: includeSecrets ? doc.secretKey || '' : maskKey(doc.secretKey),
  hasApiKey: Boolean(doc.apiKey),
  hasSecretKey: Boolean(doc.secretKey),
  isActive: Boolean(doc.isActive),
  lastTestedAt: doc.lastTestedAt,
  lastTestStatus: doc.lastTestStatus,
  lastTestMessage: doc.lastTestMessage || '',
});

/** GET /api/admin/couriers */
export const getCouriers = async (req, res) => {
  try {
    await ensureDefaultCouriers();
    const couriers = await CourierSetting.find().sort({ name: 1 }).lean();
    return res.json({
      couriers: couriers.map((c) => formatCourier(c, { includeSecrets: true })),
    });
  } catch (error) {
    console.error('getCouriers error:', error);
    return res.status(500).json({ message: 'Failed to load courier settings' });
  }
};

/** PUT /api/admin/couriers/:slug */
export const updateCourier = async (req, res) => {
  try {
    await ensureDefaultCouriers();
    const { slug } = req.params;
    const { apiKey, secretKey, isActive } = req.body;

    const courier = await CourierSetting.findOne({ slug: slug.toLowerCase() });
    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    if (apiKey !== undefined) courier.apiKey = String(apiKey).trim();
    if (secretKey !== undefined) courier.secretKey = String(secretKey).trim();
    if (isActive !== undefined) courier.isActive = Boolean(isActive);

    await courier.save();

    return res.json({
      message: 'Courier settings saved',
      courier: formatCourier(courier.toObject(), { includeSecrets: true }),
    });
  } catch (error) {
    console.error('updateCourier error:', error);
    return res.status(500).json({ message: error.message || 'Failed to save courier' });
  }
};

/** PUT /api/admin/couriers (bulk save) */
export const bulkUpdateCouriers = async (req, res) => {
  try {
    await ensureDefaultCouriers();
    const { couriers = [] } = req.body;

    if (!Array.isArray(couriers) || couriers.length === 0) {
      return res.status(400).json({ message: 'couriers array is required' });
    }

    const results = [];
    for (const item of couriers) {
      const slug = (item.slug || slugifyCourierName(item.name || '')).toLowerCase();
      if (!slug) continue;

      const courier = await CourierSetting.findOne({ slug });
      if (!courier) continue;

      if (item.apiKey !== undefined) courier.apiKey = String(item.apiKey).trim();
      if (item.secretKey !== undefined) courier.secretKey = String(item.secretKey).trim();
      if (item.isActive !== undefined) courier.isActive = Boolean(item.isActive);

      await courier.save();
      results.push(formatCourier(courier.toObject(), { includeSecrets: true }));
    }

    return res.json({
      message: 'All courier settings saved',
      couriers: results,
    });
  } catch (error) {
    console.error('bulkUpdateCouriers error:', error);
    return res.status(500).json({ message: error.message || 'Failed to save couriers' });
  }
};

/** POST /api/admin/couriers/:slug/test */
export const testCourierApi = async (req, res) => {
  try {
    const courier = await CourierSetting.findOne({
      slug: req.params.slug.toLowerCase(),
    });

    if (!courier) {
      return res.status(404).json({ message: 'Courier not found' });
    }

    if (!courier.apiKey?.trim() || !courier.secretKey?.trim()) {
      courier.lastTestedAt = new Date();
      courier.lastTestStatus = 'failed';
      courier.lastTestMessage = 'API Key and Secret Key are required';
      await courier.save();
      return res.status(400).json({
        success: false,
        message: 'API Key and Secret Key are required to test connection',
      });
    }

    try {
      const result = await testCourierConnection(courier.slug);
      courier.lastTestedAt = new Date();
      courier.lastTestStatus = 'success';
      courier.lastTestMessage = result.message;
      await courier.save();
      return res.json({
        success: true,
        message: result.message,
        courier: formatCourier(courier.toObject(), { includeSecrets: true }),
      });
    } catch (apiErr) {
      courier.lastTestedAt = new Date();
      courier.lastTestStatus = 'failed';
      courier.lastTestMessage = apiErr.message;
      await courier.save();
      return res.status(400).json({
        success: false,
        message: apiErr.message,
        courier: formatCourier(courier.toObject(), { includeSecrets: true }),
      });
    }
  } catch (error) {
    console.error('testCourierApi error:', error);
    return res.status(500).json({ message: error.message || 'API test failed' });
  }
};

/** GET /api/admin/couriers/active-names */
export const getActiveCourierNames = async (req, res) => {
  try {
    await ensureDefaultCouriers();
    const active = await CourierSetting.find({ isActive: true })
      .sort({ name: 1 })
      .select('name slug')
      .lean();

    const couriers = active.length
      ? active.map((c) => ({
          name: c.name.replace(/\s+Courier$/i, '').trim() || c.name,
          slug: c.slug,
          fullName: c.name,
          hasCredentials: Boolean(c.apiKey && c.secretKey),
        }))
      : [
          { name: 'Steadfast', slug: 'steadfast-courier', fullName: 'SteadFast Courier', hasCredentials: false },
        ];

    return res.json({ couriers });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load active couriers' });
  }
};
