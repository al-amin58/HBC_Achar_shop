import { labelDeliveryStatus, labelOrderStatus, labelPaymentMethod, labelPaymentStatus, formatOrderDate } from './orderFormatters.js';

const timelineStep = (status, description, time, completed, active, iconKey) => ({
  status,
  description,
  time: time || '—',
  completed: Boolean(completed),
  active: Boolean(active),
  iconKey: iconKey || 'box',
});

export const buildTrackTimeline = (order) => {
  const history = order.statusHistory || [];
  const courierName = order.delivery?.courier || 'Courier';
  const trackingCode = order.delivery?.trackingCode || order.delivery?.trackingId;

  const steps = [
    timelineStep(
      'Order Placed',
      'Your order has been placed successfully',
      formatOrderDate(order.createdAt),
      true,
      false,
      'box'
    ),
  ];

  const statusOrder = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered'];
  const currentIdx = statusOrder.indexOf(order.status);

  if (currentIdx >= 1) {
    steps.push(
      timelineStep(
        'Confirmed',
        'Seller has confirmed your order',
        history.find((h) => h.orderStatus === 'confirmed')?.at
          ? formatOrderDate(history.find((h) => h.orderStatus === 'confirmed').at)
          : formatOrderDate(order.updatedAt),
        true,
        false,
        'check'
      )
    );
  }

  if (order.delivery?.courier || currentIdx >= 4) {
    const shippedDone = currentIdx >= 4;
    steps.push(
      timelineStep(
        'Shipped',
        trackingCode
          ? `Shipped via ${courierName} — Tracking: ${trackingCode}`
          : `Shipped via ${courierName}`,
        order.delivery?.assignedAt
          ? formatOrderDate(order.delivery.assignedAt)
          : formatOrderDate(order.updatedAt),
        shippedDone,
        order.status === 'shipped',
        'truck'
      )
    );
  }

  if (order.delivery?.courierStatus) {
    const cs = String(order.delivery.courierStatus).replace(/_/g, ' ');
    steps.push(
      timelineStep(
        'Courier Update',
        `Live status from ${courierName}: ${cs}`,
        formatOrderDate(order.delivery.lastSyncedAt || order.updatedAt),
        order.status === 'delivered',
        order.status === 'shipped',
        'map'
      )
    );
  }

  if (order.status === 'delivered') {
    steps.push(
      timelineStep(
        'Delivered',
        'Order delivered successfully',
        formatOrderDate(order.updatedAt),
        true,
        false,
        'home'
      )
    );
  } else if (order.status !== 'cancelled') {
    steps.push(
      timelineStep(
        'Out for Delivery',
        'Courier is on the way to your address',
        'Expected soon',
        false,
        order.status === 'shipped',
        'map'
      )
    );
    steps.push(
      timelineStep(
        'Delivered',
        'Order will be marked delivered upon receipt',
        '—',
        false,
        false,
        'home'
      )
    );
  }

  if (order.status === 'cancelled') {
    steps.push(
      timelineStep(
        'Cancelled',
        'This order has been cancelled',
        formatOrderDate(order.updatedAt),
        true,
        false,
        'x'
      )
    );
  }

  return steps;
};

export const mapOrderToTrackView = (order) => {
  const discount =
    (order.pricing?.discount || 0) +
    (order.pricing?.walletUsed || 0) +
    (order.pricing?.coinDiscount || 0);

  let uiStatus = order.status;
  if (order.status === 'shipped' && order.delivery?.status === 'in_transit') {
    uiStatus = 'shipped';
  }
  if (order.status === 'delivered') uiStatus = 'delivered';
  if (order.status === 'cancelled') uiStatus = 'cancelled';
  if (order.status === 'packed') uiStatus = 'confirmed';

  const est = new Date(order.createdAt);
  est.setDate(est.getDate() + 4);

  return {
    orderId: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    estimatedDelivery: est.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    status: uiStatus,
    paymentStatus: labelPaymentStatus(order.payment?.status),
    paymentMethod:
      order.payment?.method === 'cod' ? 'Cash on Delivery' : labelPaymentMethod(order.payment?.method),
    subtotal: order.pricing?.subtotal ?? 0,
    shipping: order.pricing?.deliveryCharge ?? 0,
    discount,
    total: order.pricing?.total ?? 0,
    customer: {
      name: order.customer?.fullName || '',
      phone: order.customer?.phone || '',
      address:
        order.shipping?.fullAddress ||
        [order.customer?.address, order.customer?.district].filter(Boolean).join(', '),
    },
    courier: order.delivery?.courier || '',
    trackingId: order.delivery?.trackingCode || order.delivery?.trackingId || '',
    courierStatus: order.delivery?.courierStatus || '',
    timeline: buildTrackTimeline(order),
    items: (order.items || []).map((it, i) => ({
      id: String(it._id || i),
      name: it.name,
      variant: it.variationLabel || '',
      price: it.price,
      qty: it.qty,
      image: it.image || '',
    })),
    orderStatusLabel: labelOrderStatus(order.status),
    deliveryStatusLabel: labelDeliveryStatus(order.delivery?.status),
  };
};
