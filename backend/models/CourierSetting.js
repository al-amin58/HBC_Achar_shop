import mongoose from 'mongoose';

const courierSettingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true, lowercase: true },
    apiKey: { type: String, default: '' },
    secretKey: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    lastTestedAt: { type: Date, default: null },
    lastTestStatus: {
      type: String,
      enum: ['untested', 'success', 'failed'],
      default: 'untested',
    },
    lastTestMessage: { type: String, default: '' },
  },
  { timestamps: true }
);

export const DEFAULT_COURIERS = [
  'Pathao Courier',
  'SteadFast Courier',
  'RedX',
  'Paperfly',
  'Sundarban Courier',
  'eCourier',
  'Delivery Tiger',
  'SA Paribahan',
  'Janani Express',
  'DHL',
  'FedEx',
];

export const slugifyCourierName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default mongoose.model('CourierSetting', courierSettingSchema);
