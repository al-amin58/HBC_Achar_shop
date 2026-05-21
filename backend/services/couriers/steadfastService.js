const STEADFAST_BASE_URL =
  process.env.STEADFAST_API_URL || 'https://portal.packzy.com/api/v1';

const steadfastRequest = async (path, method, credentials, body) => {
  const url = `${STEADFAST_BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Api-Key': credentials.apiKey,
      'Secret-Key': credentials.secretKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Steadfast API error (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.response = data;
    throw err;
  }

  return data;
};

/** Test connection via balance endpoint */
export const testSteadfastConnection = async (credentials) => {
  const data = await steadfastRequest('/get_balance', 'GET', credentials);
  return {
    success: true,
    message: `Connected. Current balance: ৳${data.current_balance ?? 0}`,
    balance: data.current_balance,
  };
};

/** Create consignment — POST /create_order */
export const createSteadfastOrder = async (credentials, payload) => {
  const data = await steadfastRequest('/create_order', 'POST', credentials, payload);
  if (!data?.consignment) {
    throw new Error(data?.message || 'Steadfast did not return consignment data');
  }
  return data;
};

/** GET /status_by_invoice/{invoice} */
export const getSteadfastStatusByInvoice = async (credentials, invoice) => {
  const encoded = encodeURIComponent(invoice);
  return steadfastRequest(`/status_by_invoice/${encoded}`, 'GET', credentials);
};

/** GET /status_by_trackingcode/{code} */
export const getSteadfastStatusByTrackingCode = async (credentials, trackingCode) => {
  const encoded = encodeURIComponent(trackingCode);
  return steadfastRequest(`/status_by_trackingcode/${encoded}`, 'GET', credentials);
};

/** Map Steadfast delivery_status → internal order/delivery status */
export const mapSteadfastDeliveryStatus = (courierStatus) => {
  const s = String(courierStatus || '').toLowerCase();
  const map = {
    pending: { orderStatus: 'shipped', deliveryStatus: 'in_transit' },
    in_review: { orderStatus: 'shipped', deliveryStatus: 'in_transit' },
    hold: { orderStatus: 'processing', deliveryStatus: 'processing' },
    delivered: { orderStatus: 'delivered', deliveryStatus: 'delivered' },
    partial_delivered: { orderStatus: 'delivered', deliveryStatus: 'delivered' },
    cancelled: { orderStatus: 'cancelled', deliveryStatus: 'cancelled' },
    cancelled_approval_pending: { orderStatus: 'cancelled', deliveryStatus: 'cancelled' },
    delivered_approval_pending: { orderStatus: 'delivered', deliveryStatus: 'delivered' },
    partial_delivered_approval_pending: { orderStatus: 'delivered', deliveryStatus: 'delivered' },
    unknown: { orderStatus: 'shipped', deliveryStatus: 'in_transit' },
    unknown_approval_pending: { orderStatus: 'shipped', deliveryStatus: 'in_transit' },
  };
  return map[s] || { orderStatus: 'shipped', deliveryStatus: 'in_transit' };
};

export const buildSteadfastPayload = (order) => {
  const phone = String(order.customer?.phone || '').replace(/\D/g, '');
  const normalizedPhone =
    phone.length === 13 && phone.startsWith('880')
      ? phone.slice(2)
      : phone.length === 10
      ? `0${phone}`
      : phone;

  const fullAddress =
    order.shipping?.fullAddress ||
    [order.customer?.address, order.customer?.thana, order.customer?.district, order.customer?.division]
      .filter(Boolean)
      .join(', ');

  const isCod = order.payment?.method === 'cod';
  const codAmount = isCod ? Math.max(0, Number(order.payment?.due ?? order.pricing?.total ?? 0)) : 0;

  const itemDescription = (order.items || [])
    .map((i) => `${i.name}${i.variationLabel ? ` (${i.variationLabel})` : ''} x${i.qty}`)
    .join(', ')
    .slice(0, 250);

  return {
    invoice: order.orderNumber,
    recipient_name: (order.customer?.fullName || 'Customer').slice(0, 100),
    recipient_phone: normalizedPhone,
    recipient_address: fullAddress.slice(0, 250),
    cod_amount: codAmount,
    note: (order.orderNote || order.adminNote || '').slice(0, 200),
    item_description: itemDescription || 'HBC Achar products',
    recipient_email: order.customer?.email || undefined,
    delivery_type: 0,
  };
};
