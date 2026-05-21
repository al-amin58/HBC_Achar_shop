import { normalizeBdPhone } from '../utils/phoneHelper.js';

const getSiteUrl = () =>
  process.env.FRONTEND_URL || process.env.SITE_URL || 'http://localhost:5173';

export const buildTrackingSms = (order, trackingCode, courierName) => {
  const phone = normalizeBdPhone(order.customer?.phone);
  const orderNo = order.orderNumber;
  const trackUrl = `${getSiteUrl()}/track-order?orderId=${encodeURIComponent(orderNo)}&phone=${encodeURIComponent(phone)}`;
  const code = trackingCode || order.delivery?.trackingId || '—';

  return (
    `HBC Achar: আপনার অর্ডার ${orderNo} ${courierName || 'কুরিয়ার'} এর মাধ্যমে পাঠানো হয়েছে। ` +
    `ট্র্যাকিং: ${code}. ট্র্যাক করুন: ${trackUrl}`
  );
};

/**
 * Send SMS — uses env SMS_API_URL if set, otherwise logs (dev) and returns success.
 * Configure: SMS_API_URL, SMS_API_KEY, SMS_SENDER_ID
 */
export const sendSms = async (phone, message) => {
  const to = normalizeBdPhone(phone);
  if (!to || to.length < 11) {
    throw new Error('Invalid phone number for SMS');
  }

  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;

  if (apiUrl && apiKey) {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        to,
        message,
        sender: process.env.SMS_SENDER_ID || 'HBC Achar',
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(errText || `SMS gateway error ${res.status}`);
    }
    return { sent: true, provider: 'gateway', to };
  }

  // Development / fallback — log SMS (still saved on order record)
  console.log('[SMS]', to, message);
  return { sent: true, provider: 'log', to, message };
};

export const sendOrderTrackingSms = async (order, trackingCode, courierName) => {
  const message = buildTrackingSms(order, trackingCode, courierName);
  const result = await sendSms(order.customer?.phone, message);
  return { message, ...result };
};
