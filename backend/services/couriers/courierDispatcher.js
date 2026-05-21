import CourierSetting from '../../models/CourierSetting.js';
import { slugifyCourierName } from '../../models/CourierSetting.js';
import {
  buildSteadfastPayload,
  createSteadfastOrder,
  getSteadfastStatusByInvoice,
  getSteadfastStatusByTrackingCode,
  mapSteadfastDeliveryStatus,
  testSteadfastConnection,
} from './steadfastService.js';

const STEADFAST_SLUGS = new Set(['steadfast', 'steadfast-courier', 'steadfast-courier-limited']);

export const resolveCourierSlug = (nameOrSlug) => {
  const raw = String(nameOrSlug || '').trim().toLowerCase();
  if (!raw) return '';
  if (raw.includes('steadfast') || raw === 'steadfast') return 'steadfast-courier';
  if (raw.includes('pathao')) return 'pathao-courier';
  if (raw === 'redx') return 'redx';
  return slugifyCourierName(nameOrSlug);
};

export const getCourierCredentials = async (slugOrName) => {
  const slug = resolveCourierSlug(slugOrName);
  let courier = await CourierSetting.findOne({ slug });
  if (!courier && slugOrName) {
    courier = await CourierSetting.findOne({
      name: new RegExp(String(slugOrName).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    });
  }
  if (!courier) {
    throw new Error(`Courier "${slugOrName}" is not configured in settings`);
  }
  if (!courier.isActive) {
    throw new Error(`${courier.name} is not active. Enable it in Courier API Settings.`);
  }
  if (!courier.apiKey?.trim() || !courier.secretKey?.trim()) {
    throw new Error(`${courier.name} API Key and Secret Key are required`);
  }
  return courier;
};

export const testCourierConnection = async (slug) => {
  const courier = await CourierSetting.findOne({ slug: slug.toLowerCase() });
  if (!courier?.apiKey || !courier?.secretKey) {
    throw new Error('API Key and Secret Key are required');
  }
  const credentials = { apiKey: courier.apiKey, secretKey: courier.secretKey };

  if (STEADFAST_SLUGS.has(courier.slug) || courier.slug.includes('steadfast')) {
    return testSteadfastConnection(credentials);
  }

  throw new Error(`Live API test is not yet available for ${courier.name}. Steadfast is fully supported.`);
};

/** Create shipment with courier API and return normalized result */
export const dispatchOrderToCourier = async (order, courierSlugOrName) => {
  const courier = await getCourierCredentials(courierSlugOrName);
  const credentials = { apiKey: courier.apiKey, secretKey: courier.secretKey };

  if (STEADFAST_SLUGS.has(courier.slug) || courier.slug.includes('steadfast')) {
    const payload = buildSteadfastPayload(order);
    const result = await createSteadfastOrder(credentials, payload);
    const c = result.consignment;

    const mapped = mapSteadfastDeliveryStatus(c.status);

    return {
      courierName: courier.name,
      courierSlug: courier.slug,
      consignmentId: c.consignment_id,
      trackingCode: c.tracking_code,
      trackingId: c.tracking_code,
      courierStatus: c.status,
      invoice: c.invoice,
      orderStatus: mapped.orderStatus,
      deliveryStatus: mapped.deliveryStatus,
      raw: result,
    };
  }

  throw new Error(
    `${courier.name} API integration is coming soon. Please use Steadfast Courier for automatic dispatch.`
  );
};

/** Refresh live status from courier API */
export const refreshCourierStatus = async (order) => {
  const slug = order.delivery?.courierSlug || resolveCourierSlug(order.delivery?.courier);
  const courier = await getCourierCredentials(slug);
  const credentials = { apiKey: courier.apiKey, secretKey: courier.secretKey };

  if (STEADFAST_SLUGS.has(courier.slug) || courier.slug.includes('steadfast')) {
    const trackingCode = order.delivery?.trackingCode || order.delivery?.trackingId;
    let data;
    if (trackingCode) {
      data = await getSteadfastStatusByTrackingCode(credentials, trackingCode);
    } else {
      data = await getSteadfastStatusByInvoice(credentials, order.orderNumber);
    }
    const courierStatus = data.delivery_status;
    const mapped = mapSteadfastDeliveryStatus(courierStatus);
    return { courierStatus, ...mapped };
  }

  return null;
};
