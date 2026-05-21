/** Map admin Orders.jsx row → shape expected by Invoice buildInvoiceView */
export const mapAdminOrderToInvoiceOrder = (adminOrder) => {
  const paymentMethodMap = {
    COD: "cod",
    bKash: "bkash",
    Nagad: "nagad",
    Wallet: "wallet",
    Card: "card",
  };
  const paymentStatusMap = {
    Paid: "paid",
    Pending: "pending",
    Failed: "failed",
    Refunded: "refunded",
    Cancelled: "cancelled",
  };

  return {
    orderNumber: adminOrder.id,
    createdAt: adminOrder.createdAt || new Date().toISOString(),
    monthlySubscription: false,
    customer: {
      fullName: adminOrder.customer?.name || "",
      phone: adminOrder.customer?.phone || "",
      email: adminOrder.customer?.email || "",
      address: adminOrder.customer?.address || "",
      district: adminOrder.customer?.district || "",
      thana: "",
    },
    shipping: {
      fullAddress: [adminOrder.customer?.address, adminOrder.customer?.district]
        .filter(Boolean)
        .join(", "),
      deliveryCharge: adminOrder.shipping ?? 0,
    },
    items: (adminOrder.products || []).map((p, i) => ({
      id: p.sku || `item-${i}`,
      name: p.name,
      variation: p.variation,
      variationLabel: p.variation,
      productId: p.sku,
      price: p.price,
      qty: p.qty,
      total: p.price * p.qty,
    })),
    pricing: {
      subtotal: adminOrder.subtotal ?? 0,
      discount: adminOrder.coupon ?? 0,
      couponCode: "",
      deliveryCharge: adminOrder.shipping ?? 0,
      walletUsed: adminOrder.walletUsed ?? 0,
      total: adminOrder.total ?? 0,
    },
    payment: {
      method: paymentMethodMap[adminOrder.paymentMethod] || "cod",
      status: paymentStatusMap[adminOrder.paymentStatus] || "pending",
      paid: adminOrder.paymentStatus === "Paid" ? adminOrder.total ?? 0 : 0,
      due: adminOrder.paymentStatus === "Paid" ? 0 : adminOrder.total ?? 0,
    },
    orderNote: adminOrder.customer?.note || "",
  };
};

/** Open website Invoice page for an admin order (new tab) */
export const openAdminInvoice = (order, { print = true } = {}) => {
  if (!order?._id) return;
  const params = new URLSearchParams({ id: order._id, admin: "1" });
  if (print) params.set("print", "1");
  window.open(
    `${window.location.origin}/invoice?${params.toString()}`,
    "_blank",
    "noopener,noreferrer"
  );
};

/** Download selected orders as CSV */
export const exportOrdersToCsv = (orders, filename) => {
  if (!orders?.length) return false;

  const headers = [
    "Order ID",
    "Date",
    "Customer Name",
    "Phone",
    "Email",
    "Address",
    "District",
    "Products",
    "Subtotal",
    "Shipping",
    "Coupon Discount",
    "Wallet Used",
    "Total",
    "Payment Method",
    "Payment Status",
    "Order Status",
    "Delivery Status",
    "Courier",
    "Tracking ID",
    "Source",
  ];

  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = orders.map((o) => {
    const products = (o.products || [])
      .map((p) => `${p.name} (${p.variation || "—"}) x${p.qty}`)
      .join("; ");
    return [
      o.id,
      o.orderDate,
      o.customer?.name,
      o.customer?.phone,
      o.customer?.email,
      o.customer?.address,
      o.customer?.district,
      products,
      o.subtotal,
      o.shipping,
      o.coupon,
      o.walletUsed,
      o.total,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      o.deliveryStatus,
      o.courier || "",
      o.trackingId || "",
      o.source,
    ];
  });

  const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join(
    "\r\n"
  );
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};
