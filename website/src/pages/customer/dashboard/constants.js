// ─── Shared helpers ───────────────────────────────────────────────────────────
export const fmtBDT = (n) =>
  '৳' + new Intl.NumberFormat('en-BD').format(Number(n) || 0);

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/** Map API order shape → dashboard table/card shape */
export const mapOrderForUI = (order) => {
  const first = order.items?.[0];
  const qty = (order.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0);
  const status = (order.status || 'pending').toLowerCase();
  const payStatus = (order.payment?.status || 'pending').toLowerCase();
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt,
    createdAt: order.createdAt,
    product: first?.name || 'অর্ডার',
    image: first?.image || '',
    variation: first?.variationLabel || first?.variation || '',
    qty: qty || 1,
    price: order.pricing?.total ?? 0,
    paymentStatus: payStatus === 'paid' ? 'paid' : payStatus,
    deliveryStatus: status,
    courierStatus: status === 'shipped' ? 'in_transit' : status === 'delivered' ? 'delivered' : 'pending',
    fraudStatus: 'clear',
    status,
    items: order.items,
    pricing: order.pricing,
    payment: order.payment,
    customer: order.customer,
    shipping: order.shipping,
  };
};

export const STATUS_COLOR = {
  pending:    'orange',
  confirmed:  'blue',
  processing: 'geekblue',
  shipped:    'purple',
  delivered:  'green',
  cancelled:  'red',
  paid:       'green',
  failed:     'red',
  refunded:   'default',
  clear:      'green',
  review:     'gold',
  approved:   'green',
  rejected:   'red',
};

// ─── Demo orders ─────────────────────────────────────────────────────────────
export const DEMO_ORDERS = [
  {
    id: 'ORD-2024-001', orderNumber: 'HBC-001', date: '2024-05-10',
    product: 'Chaltar Achar (Homemade)', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&q=70',
    variation: '500g • Medium Spicy', qty: 2, price: 420,
    paymentStatus: 'paid', deliveryStatus: 'delivered', courierStatus: 'delivered',
    fraudStatus: 'clear', status: 'delivered',
  },
  {
    id: 'ORD-2024-002', orderNumber: 'HBC-002', date: '2024-05-14',
    product: 'Mango Achar (Kacha)', image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=80&q=70',
    variation: '1kg • High Spicy', qty: 1, price: 420,
    paymentStatus: 'paid', deliveryStatus: 'shipped', courierStatus: 'in_transit',
    fraudStatus: 'clear', status: 'shipped',
  },
  {
    id: 'ORD-2024-003', orderNumber: 'HBC-003', date: '2024-05-17',
    product: 'Mixed Vegetable Achar', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=80&q=70',
    variation: '500g • Premium', qty: 3, price: 840,
    paymentStatus: 'pending', deliveryStatus: 'pending', courierStatus: 'pending',
    fraudStatus: 'review', status: 'pending',
  },
];

// ─── Demo transactions ────────────────────────────────────────────────────────
export const DEMO_TXN = [
  { id: 'TXN-001', type: 'credit', label: 'Cashback on Order HBC-001', amount: 21, date: '2024-05-10' },
  { id: 'TXN-002', type: 'credit', label: 'Wallet Recharge', amount: 500, date: '2024-05-12' },
  { id: 'TXN-003', type: 'debit',  label: 'Payment for HBC-003',       amount: 840, date: '2024-05-17' },
  { id: 'TXN-004', type: 'credit', label: 'Referral Bonus',            amount: 50,  date: '2024-05-18' },
];

// ─── Demo wallet chart data ────────────────────────────────────────────────────
export const WALLET_CHART = [
  { day: 'Mon', balance: 300 }, { day: 'Tue', balance: 820 },
  { day: 'Wed', balance: 650 }, { day: 'Thu', balance: 700 },
  { day: 'Fri', balance: 480 }, { day: 'Sat', balance: 910 },
  { day: 'Sun', balance: 580 },
];

// ─── Demo notifications ───────────────────────────────────────────────────────
export const DEMO_NOTIF = [
  { id: 'n1', type: 'order',  title: 'Order Shipped!', body: 'Your order HBC-002 is on the way.', read: false, date: '2024-05-14' },
  { id: 'n2', type: 'wallet', title: 'Cashback Credited', body: '৳21 cashback added to wallet.', read: false, date: '2024-05-10' },
  { id: 'n3', type: 'flash',  title: 'Flash Sale Live 🔥', body: 'Up to 40% off. Limited stock!', read: true,  date: '2024-05-09' },
  { id: 'n4', type: 'lp',     title: 'Landing Page Approved', body: 'Your request has been approved.', read: true, date: '2024-05-08' },
];

// ─── Demo wishlist ────────────────────────────────────────────────────────────
export const DEMO_WISHLIST = [
  { id: 'w1', name: 'Chaltar Achar', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=70', price: 210, variation: '500g', stock: 18, rating: 4.7 },
  { id: 'w2', name: 'Mango Achar',   image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=300&q=70', price: 420, variation: '1kg',  stock: 7,  rating: 4.9 },
  { id: 'w3', name: 'Garlic Pickle', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=70', price: 220, variation: '250g', stock: 0,  rating: 4.5 },
];

// ─── Demo flash products ──────────────────────────────────────────────────────
export const FLASH_PRODUCTS = [
  { id: 'f1', name: 'Chaltar Achar',      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=70', price: 149, oldPrice: 210, stock: 12, total: 30, discount: 29 },
  { id: 'f2', name: 'Mango Achar 1kg',    image: 'https://images.unsplash.com/photo-1589187154184-995b8a4e740a?w=300&q=70', price: 299, oldPrice: 420, stock: 5,  total: 20, discount: 29 },
  { id: 'f3', name: 'Mixed Veg Achar',    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=300&q=70', price: 189, oldPrice: 280, stock: 8,  total: 25, discount: 32 },
  { id: 'f4', name: 'Garlic Pickle Sp.', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=70', price: 155, oldPrice: 220, stock: 3,  total: 15, discount: 30 },
];

// ─── Demo support tickets ─────────────────────────────────────────────────────
export const DEMO_TICKETS = [
  { id: 'TK-001', subject: 'Order not received', status: 'open',     date: '2024-05-15', category: 'Delivery' },
  { id: 'TK-002', subject: 'Wrong item delivered', status: 'resolved', date: '2024-05-08', category: 'Product' },
];

// ─── Demo landing requests ────────────────────────────────────────────────────
export const DEMO_LP = [
  { id: 'LP-001', name: 'My Achar Store', product: 'Chaltar Achar', theme: 'Modern', status: 'approved', date: '2024-05-01', adminNote: 'Great request! Live now.' },
  { id: 'LP-002', name: 'Pickle Palace',  product: 'Mango Achar',   theme: 'Classic', status: 'pending', date: '2024-05-16', adminNote: '' },
];
