const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

const titleCase = (s) =>
  (s || '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const PAYMENT_METHOD_LABELS = {
  cod: 'COD',
  bkash: 'bKash',
  nagad: 'Nagad',
  wallet: 'Wallet',
  card: 'Card',
};

const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const DELIVERY_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready_for_pickup: 'Ready for Pickup',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

export const labelOrderStatus = (status) =>
  ORDER_STATUS_LABELS[(status || 'pending').toLowerCase()] || titleCase(status);

export const labelDeliveryStatus = (status) =>
  DELIVERY_STATUS_LABELS[(status || 'pending').toLowerCase()] || titleCase(status);

export const labelPaymentStatus = (status) =>
  PAYMENT_STATUS_LABELS[(status || 'pending').toLowerCase()] || titleCase(status);

export const labelPaymentMethod = (method) =>
  PAYMENT_METHOD_LABELS[(method || 'cod').toLowerCase()] || titleCase(method);

export const normalizeOrderStatus = (label) => {
  const map = Object.fromEntries(
    Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => [v.toLowerCase(), k])
  );
  const key = (label || '').toLowerCase().replace(/\s+/g, '_');
  return map[(label || '').toLowerCase()] || key || 'pending';
};

export const normalizeDeliveryStatus = (label) => {
  const map = {
    pending: 'pending',
    confirmed: 'confirmed',
    processing: 'processing',
    'ready for pickup': 'ready_for_pickup',
    ready_for_pickup: 'ready_for_pickup',
    'in transit': 'in_transit',
    in_transit: 'in_transit',
    delivered: 'delivered',
    cancelled: 'cancelled',
    returned: 'returned',
  };
  return map[(label || '').toLowerCase()] || (label || 'pending').toLowerCase().replace(/\s+/g, '_');
};

export const normalizePaymentStatus = (label) => {
  const map = Object.fromEntries(
    Object.entries(PAYMENT_STATUS_LABELS).map(([k, v]) => [v.toLowerCase(), k])
  );
  return map[(label || '').toLowerCase()] || (label || 'pending').toLowerCase();
};

export const formatOrderDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const computeFlashDiscount = (items = []) =>
  items.reduce((sum, it) => {
    if (!it.isFlashSale || it.oldPrice == null) return sum;
    const diff = Math.max(0, Number(it.oldPrice) - Number(it.price));
    return sum + diff * (Number(it.qty) || 1);
  }, 0);

const resolveSourceLabel = (order) => {
  if (order.source?.isLandingPage) return 'Landing Page';
  if (order.source?.isFlashSale) return 'Flash Sale';
  return 'Website';
};

/** Admin Orders.jsx UI shape */
export const formatAdminOrder = (order, user = null) => {
  const items = order.items || [];
  const flashDiscount = computeFlashDiscount(items);
  const isFlashSale = Boolean(
    order.source?.isFlashSale || items.some((i) => i.isFlashSale)
  );
  const isLandingPage = Boolean(order.source?.isLandingPage);
  const totalSpend = Number(user?.totalSpend) || 0;
  const totalOrders = Number(user?.totalOrders) || 0;

  return {
    _id: String(order._id),
    id: order.orderNumber,
    customer: {
      name: order.customer?.fullName || '',
      phone: order.customer?.phone || '',
      avatar:
        user?.image ||
        `https://i.pravatar.cc/150?u=${encodeURIComponent(order.customer?.phone || order._id)}`,
      email: order.customer?.email || '',
      address: order.customer?.address || '',
      district: order.customer?.district || '',
      note: order.orderNote || '',
    },
    products: items.map((p) => ({
      name: p.name,
      sku: p.productId || '—',
      image: p.image || '',
      variation: p.variationLabel || '',
      qty: p.qty,
      price: p.price,
    })),
    subtotal: order.pricing?.subtotal ?? 0,
    shipping: order.pricing?.deliveryCharge ?? 0,
    coupon: order.pricing?.discount ?? 0,
    flashDiscount,
    walletUsed: order.pricing?.walletUsed ?? 0,
    total: order.pricing?.total ?? 0,
    paymentMethod: labelPaymentMethod(order.payment?.method),
    paymentStatus: labelPaymentStatus(order.payment?.status),
    orderStatus: labelOrderStatus(order.status),
    deliveryStatus: labelDeliveryStatus(order.delivery?.status),
    source: resolveSourceLabel(order),
    orderDate: formatOrderDate(order.createdAt),
    createdAt: order.createdAt,
    isFlashSale,
    isLandingPage,
    isVIP: Boolean(order.tags?.isVIP) || totalSpend >= 5000,
    isRepeat: Boolean(order.tags?.isRepeat) || totalOrders > 1,
    courier: order.delivery?.courier || null,
    trackingId: order.delivery?.trackingCode || order.delivery?.trackingId || null,
    courierStatus: order.delivery?.courierStatus || null,
    smsSent: Boolean(order.delivery?.smsSent),
    transactionId: order.transactionId || null,
    adminNote: order.adminNote || '',
    fraudScore: order.fraud?.score ?? 0,
    isFraudulent: Boolean(order.fraud?.isFraudulent),
    fraudMeta: {
      ipAddress: order.fraud?.ipAddress || '—',
      device: order.fraud?.device || '—',
    },
    statusHistory: (order.statusHistory || []).map((h) => ({
      orderStatus: labelOrderStatus(h.orderStatus),
      deliveryStatus: labelDeliveryStatus(h.deliveryStatus),
      note: h.note || '',
      at: h.at,
      formattedAt: formatOrderDate(h.at),
    })),
  };
};

export const formatCustomerOrder = (order) => ({
  id: String(order._id),
  orderNumber: order.orderNumber,
  items: (order.items || []).map((it) => ({
    id: String(it._id),
    productId: it.productId,
    name: it.name,
    image: it.image,
    variation: it.variationLabel,
    variationLabel: it.variationLabel,
    price: it.price,
    oldPrice: it.oldPrice,
    isFlashSale: it.isFlashSale,
    qty: it.qty,
    total: it.lineTotal,
  })),
  customer: order.customer,
  shipping: order.shipping,
  pricing: order.pricing,
  payment: order.payment,
  monthlySubscription: Boolean(order.monthlySubscription),
  orderNote: order.orderNote || '',
  status: order.status,
  delivery: order.delivery,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});
