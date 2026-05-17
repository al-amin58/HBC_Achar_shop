import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import api from "../../api/axios";
import { toast } from "react-toastify";

const getApiErrorMessage = (err, fallback) =>
  err?.response?.data?.message ||
  (typeof err?.response?.data === "string" ? err.response.data : null) ||
  err?.message ||
  fallback;

/* --- Reusable UI Components --- */

const Toggle = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-sm hover:bg-white/15 transition-all duration-300">
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-white">{label}</h4>
      {description && <p className="text-xs text-white/50 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-gradient-to-r from-orange-300 to-green-400' : 'bg-white/20'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const InputField = ({ label, type = "text", value, onChange, placeholder, description, icon }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-white/90">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </label>
    {description && <p className="text-xs text-white/50">{description}</p>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-300 shadow-sm"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-white/90">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-300 shadow-sm resize-none"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, description }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-white/90">{label}</label>
    {description && <p className="text-xs text-white/50">{description}</p>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent transition-all duration-300 shadow-sm appearance-none cursor-pointer"
    >
      <option value="" className="bg-[#3d0c3d] text-white">
        Select...
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#3d0c3d] text-white">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const Card = ({ children, title, icon, className = "" }) => {
  const hasOverflow = className.includes("overflow-");
  return (
    <div
      className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:shadow-orange-500/10 transition-all duration-300 ${
        !hasOverflow ? "overflow-hidden" : ""
      } ${className}`}
    >
      {(title || icon) && (
        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/10 to-transparent">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {icon && <span className="text-orange-300">{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
};

const Button = ({ children, onClick, variant = "primary", type = "button", className = "" }) => {
  const baseClasses = "px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#3d0c3d]";
  const variants = {
    primary: "bg-gradient-to-r from-orange-300 to-green-400 text-gray-900 hover:from-orange-400 hover:to-green-500 focus:ring-orange-300",
    secondary: "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus:ring-white/30",
    danger: "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 focus:ring-red-400",
    outline: "border-2 border-orange-300/50 text-orange-300 hover:bg-orange-500/10 focus:ring-orange-300"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const FileUpload = ({ label, onChange, preview, accept = "image/*" }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-white/90">{label}</label>
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
        id={`file-${label.replace(/\s+/g, '-')}`}
      />
      <label
        htmlFor={`file-${label.replace(/\s+/g, '-')}`}
        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-orange-300/30 rounded-xl bg-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/10 hover:border-orange-400/50 transition-all duration-300"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="h-full w-auto object-contain rounded-lg" />
        ) : (
          <div className="text-center">
            <div className="text-3xl mb-1">📤</div>
            <span className="text-sm text-white/50">Click to upload</span>
          </div>
        )}
      </label>
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
    <span className="text-sm font-medium text-white/80">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/50 font-mono">{value}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 rounded-lg border-2 border-white/20 shadow-sm cursor-pointer overflow-hidden bg-transparent"
      />
    </div>
  </div>
);

const ProductPicker = ({
  title,
  icon,
  placeholder,
  products,
  loading,
  error,
  onRetry,
  selected,
  onAdd,
  onRemove,
  defaultSort,
}) => {
  const [q, setQ] = useState("");

  const selectedIds = useMemo(
    () => new Set((Array.isArray(selected) ? selected : []).map((p) => String(p.id))),
    [selected]
  );

  const list = useMemo(() => {
    const base = Array.isArray(products) ? products : [];
    const query = q.toLowerCase().trim();
    if (!query) return [];
    const sorted =
      defaultSort === "sold_desc"
        ? [...base].sort((a, b) => (Number(b.soldCount) || 0) - (Number(a.soldCount) || 0))
        : base;
    const filtered = query
      ? sorted.filter(
          (p) =>
            String(p.name || "").toLowerCase().includes(query) ||
            String(p.sku || "").toLowerCase().includes(query)
        )
      : sorted;
    return filtered;
  }, [defaultSort, products, q]);

  const renderThumb = (p) => {
    const src = typeof p?.image === "string" ? p.image.trim() : "";
    const looksLikeEmoji = src && src.length <= 4 && !src.includes("/") && !src.includes(".");
    if (src && !looksLikeEmoji) {
      return <img src={src} alt={p?.name || ""} className="h-9 w-9 rounded-lg object-cover border border-white/10" />;
    }
    if (src && looksLikeEmoji) return <span className="text-2xl leading-none">{src}</span>;
    return <span className="text-2xl leading-none">🛍️</span>;
  };

  return (
    <Card title={title} icon={icon} className={`overflow-visible relative ${q.trim() ? 'z-40' : 'z-10'}`}>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 pr-20"
          />
          <div className="absolute right-4 top-3.5 flex items-center gap-2">
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-white/40 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
            <span className="text-white/40">🔍</span>
          </div>

          {!loading && !error && q.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#2d0c2d] rounded-xl border border-white/15 shadow-2xl overflow-hidden z-30 max-h-80 overflow-y-auto">
              {list.length > 0 ? (
                list.map((product) => {
                  const disabled = selectedIds.has(String(product.id));
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        if (disabled) return;
                        onAdd(product);
                        setQ("");
                      }}
                      className={`w-full text-left flex items-center justify-between gap-4 p-3 hover:bg-white/10 border-b border-white/10 last:border-b-0 ${
                        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {renderThumb(product)}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                          <p className="text-xs text-white/50">
                            {product.price != null ? `৳${product.price}` : "—"}
                            {product.sku ? ` • ${product.sku}` : ""}
                            {defaultSort === "sold_desc" && Number(product.soldCount) > 0 ? ` • Sold: ${product.soldCount}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${disabled ? "text-green-300" : "text-white/60"}`}>
                        {disabled ? "Selected" : "Select"}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="p-3 text-sm text-white/60">No products found.</div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-white/50">Loading products...</div>
        ) : error ? (
          <div className="flex items-center justify-between gap-3 p-3 bg-red-500/10 border border-red-400/20 rounded-xl">
            <div className="text-sm text-red-200">{error}</div>
            {onRetry && (
              <Button variant="secondary" onClick={onRetry} className="whitespace-nowrap">
                Retry
              </Button>
            )}
          </div>
        ) : null}

        <div className="mt-2">
          <h4 className="text-sm font-semibold text-white/80 mb-3">Selected ({Array.isArray(selected) ? selected.length : 0})</h4>
          {Array.isArray(selected) && selected.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selected.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/20">
                  {renderThumb(product)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{product.name}</p>
                    <p className="text-xs text-white/50">{product.price != null ? `৳${product.price}` : "—"}</p>
                  </div>
                  <button onClick={() => onRemove(product.id)} className="text-red-400 hover:text-red-300 text-lg">✕</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/40 italic">No products selected yet</p>
          )}
        </div>
      </div>
    </Card>
  );
};

const Modal = ({ isOpen, onClose, title, children, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#2d0c2d] backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/20 animate-modal-in">
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="text-sm text-white/70 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={() => { onConfirm(); onClose(); }}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white drop-shadow-md">{title}</h2>
    {subtitle && <p className="text-orange-300/70 text-sm mt-1">{subtitle}</p>}
  </div>
);

/* --- Sidebar Groups Data --- */

const sidebarGroups = [
  {
    title: "Core",
    items: [
      { id: "general", label: "General Settings", icon: "⚙️" },
      { id: "store", label: "Store Settings", icon: "🏪" },
      { id: "logo", label: "Logo & Branding", icon: "🎨" },
      { id: "seo", label: "SEO Settings", icon: "🔍" },
      { id: "productsSet", label: "Products Set", icon: "🛒" },
    ]
  },
  {
    title: "Commerce",
    items: [
      { id: "payment", label: "Payment Settings", icon: "💳" },
      { id: "wallet", label: "Wallet Settings", icon: "👛" },
      { id: "flash", label: "Flash Sale", icon: "⚡" },
      { id: "shipping", label: "Shipping & Delivery", icon: "🚚" },
      { id: "tax", label: "Tax & Invoice", icon: "📄" },
      { id: "order", label: "Order Settings", icon: "📦" },
      { id: "product", label: "Product Settings", icon: "🛍️" },
      { id: "variation", label: "Variation Settings", icon: "🎭" },
    ]
  },
  {
    title: "Users",
    items: [
      { id: "customer", label: "Customer Settings", icon: "👥" },
      { id: "staff", label: "Staff & Roles", icon: "🛡️" },
      { id: "auth", label: "Auth & Security", icon: "🔐" },
    ]
  },
  {
    title: "Communication",
    items: [
      { id: "notification", label: "Notifications", icon: "🔔" },
      { id: "email", label: "Email Settings", icon: "📧" },
      { id: "sms", label: "SMS Settings", icon: "📱" },
      { id: "chat", label: "Chat & Support", icon: "💬" },
      { id: "social", label: "Social Media", icon: "🌐" },
    ]
  },
  {
    title: "Marketing",
    items: [
      { id: "landing", label: "Landing Page", icon: "🏠" },
      { id: "banner", label: "Banner Management", icon: "🖼️" },
      { id: "coupon", label: "Coupon Settings", icon: "🏷️" },
    ]
  },
  {
    title: "System",
    items: [
      { id: "backup", label: "Backup & Database", icon: "💾" },
      { id: "maintenance", label: "Maintenance", icon: "🔧" },
      { id: "api", label: "API & Integration", icon: "🔌" },
      { id: "theme", label: "Theme & Appearance", icon: "✨" },
      { id: "language", label: "Language & Currency", icon: "🌍" },
      { id: "analytics", label: "Analytics & Tracking", icon: "📊" },
      { id: "advanced", label: "Advanced Settings", icon: "🚀" },
    ]
  }
];

/* --- Main Settings Component --- */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", content: "", onConfirm: () => {} });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [productsCatalogLoading, setProductsCatalogLoading] = useState(false);
  const [productsCatalogError, setProductsCatalogError] = useState("");
  const [productsCatalogLoadedOnce, setProductsCatalogLoadedOnce] = useState(false);
  const [flashAddQuery, setFlashAddQuery] = useState("");
  const [flashAddDiscountPercent, setFlashAddDiscountPercent] = useState("");
  const [flashAutoSetOriginal, setFlashAutoSetOriginal] = useState(true);
  const [flashSearchQuery, setFlashSearchQuery] = useState("");
  const [flashSelectedIds, setFlashSelectedIds] = useState([]);
  const [flashBulkDiscountPercent, setFlashBulkDiscountPercent] = useState("");
  const [flashRestoreOnRemove, setFlashRestoreOnRemove] = useState(false);
  const [flashEditId, setFlashEditId] = useState(null);
  const [flashEditSalePrice, setFlashEditSalePrice] = useState("");
  const [flashEditOriginalPrice, setFlashEditOriginalPrice] = useState("");
  const [flashUpdating, setFlashUpdating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (!tab) return;
    const allowed = new Set(sidebarGroups.flatMap((g) => g.items).map((i) => i.id));
    if (!allowed.has(tab)) return;
    setActiveTab(tab);
  }, [location.search]);

  useEffect(() => {
    let alive = true;
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);
        setSettingsError("");
        const res = await api.get("/settings");
        const data = res?.data && typeof res.data === "object" ? res.data : {};
        if (!alive) return;
        setSettings((prev) => ({
          ...prev,
          ...data,
          featuredProducts: Array.isArray(data.featuredProducts) ? data.featuredProducts : (prev.featuredProducts || []),
          newArrivals: Array.isArray(data.newArrivals) ? data.newArrivals : (prev.newArrivals || []),
          bestSelling: Array.isArray(data.bestSelling) ? data.bestSelling : (prev.bestSelling || []),
        }));
      } catch (err) {
        if (!alive) return;
        const msg = err?.response?.data?.message || "Failed to load settings.";
        setSettingsError(msg);
        toast.error(msg);
      } finally {
        if (!alive) return;
        setSettingsLoading(false);
      }
    };
    fetchSettings();
    return () => {
      alive = false;
    };
  }, []);

  const fetchProductsCatalog = async ({ force = false } = {}) => {
    if (productsCatalogLoading) return;
    if (!force && productsCatalogLoadedOnce) return;
    try {
      setProductsCatalogLoading(true);
      setProductsCatalogError("");
      const res = await api.get("/products");
      const rows = Array.isArray(res.data) ? res.data : [];
      const normalized = rows
        .map((p) => ({
          id: p?._id ?? p?.id,
          name: String(p?.name || "").trim() || "Unnamed product",
          price: p?.price ?? null,
          originalPrice: p?.originalPrice ?? null,
          sku: p?.sku ?? "",
          image: p?.image ?? "",
          status: p?.status ?? "",
          stock: p?.stock ?? null,
          soldCount: p?.soldCount ?? p?.sold ?? p?.totalSold ?? 0,
        }))
        .filter((p) => p.id != null);
      setProductsCatalog(normalized);
      if (normalized.length === 0) {
        toast.info("No products found. Please add products first.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load products.";
      setProductsCatalogError(msg);
      toast.error(msg);
      setProductsCatalog([]);
    } finally {
      setProductsCatalogLoading(false);
      setProductsCatalogLoadedOnce(true);
    }
  };

  useEffect(() => {
    if (activeTab !== "productsSet" && activeTab !== "flash") return;
    if (productsCatalogLoadedOnce) return;
    fetchProductsCatalog();
  }, [activeTab, productsCatalogLoadedOnce]);

  const renderProductThumb = (p) => {
    const src = typeof p?.image === "string" ? p.image.trim() : "";
    const looksLikeEmoji = src && src.length <= 4 && !src.includes("/") && !src.includes(".");
    if (src && !looksLikeEmoji) {
      return <img src={src} alt={p?.name || ""} className="h-9 w-9 rounded-lg object-cover border border-white/10" />;
    }
    if (src && looksLikeEmoji) return <span className="text-2xl leading-none">{src}</span>;
    return <span className="text-2xl leading-none">🫙</span>;
  };

  const flashProducts = useMemo(() => {
    return (Array.isArray(productsCatalog) ? productsCatalog : []).filter(
      (p) => String(p?.status || "").toLowerCase() === "flash"
    );
  }, [productsCatalog]);

  const flashSelectedSet = useMemo(() => new Set((flashSelectedIds || []).map(String)), [flashSelectedIds]);

  const flashProductsFiltered = useMemo(() => {
    const q = String(flashSearchQuery || "").toLowerCase().trim();
    if (!q) return flashProducts;
    return flashProducts.filter(
      (p) =>
        String(p?.name || "").toLowerCase().includes(q) ||
        String(p?.sku || "").toLowerCase().includes(q)
    );
  }, [flashProducts, flashSearchQuery]);

  const flashCandidates = useMemo(() => {
    const q = String(flashAddQuery || "").toLowerCase().trim();
    if (!q) return [];
    const inFlash = new Set(flashProducts.map((p) => String(p.id)));
    return (Array.isArray(productsCatalog) ? productsCatalog : [])
      .filter((p) => !inFlash.has(String(p.id)))
      .filter(
        (p) =>
          String(p?.name || "").toLowerCase().includes(q) ||
          String(p?.sku || "").toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [flashAddQuery, flashProducts, productsCatalog]);

  const computeDiscountedPrice = (basePrice, percent) => {
    const b = Number(basePrice);
    const p = Number(percent);
    if (!Number.isFinite(b) || b <= 0) return null;
    if (!Number.isFinite(p) || p <= 0) return null;
    const capped = Math.min(95, Math.max(1, p));
    const next = Math.round(b * (1 - capped / 100));
    return Math.max(0, next);
  };

  const refreshProducts = async () => {
    await fetchProductsCatalog({ force: true });
  };

  const addFlashProduct = async (product) => {
    if (flashUpdating) return;
    if (!settings.flashSaleEnabled) {
      toast.warning("Flash sale is disabled. Enable it first.");
      return;
    }
    if (flashLimit != null && flashProducts.length >= flashLimit) {
      toast.warning("Flash sale product limit reached.");
      return;
    }
    setFlashUpdating(true);
    try {
      const payload = { status: "flash" };
      const currentPrice = product?.price ?? null;
      const currentOriginal = product?.originalPrice ?? null;

      let base = currentOriginal ?? currentPrice;
      if (flashAutoSetOriginal && currentOriginal == null && currentPrice != null) {
        payload.originalPrice = Number(currentPrice);
        base = Number(currentPrice);
      }

      const discounted = computeDiscountedPrice(base, flashAddDiscountPercent);
      if (discounted != null && base != null) {
        payload.originalPrice = Number(base);
        payload.price = discounted;
      }

      await api.put(`/products/${product.id}`, payload);
      toast.success("Added to flash sale.");
      setFlashAddQuery("");
      await refreshProducts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not add to flash sale."));
    } finally {
      setFlashUpdating(false);
    }
  };

  const removeFlashProduct = async (productId) => {
    if (flashUpdating) return;
    const p = (Array.isArray(productsCatalog) ? productsCatalog : []).find((x) => String(x.id) === String(productId));
    if (!p) return;
    setFlashUpdating(true);
    try {
      const payload = { status: "active" };
      if (flashRestoreOnRemove && p.originalPrice != null && Number.isFinite(Number(p.originalPrice))) {
        payload.price = Number(p.originalPrice);
        payload.originalPrice = null;
      }
      await api.put(`/products/${p.id}`, payload);
      toast.success("Removed from flash sale.");
      setFlashSelectedIds((cur) => (cur || []).filter((id) => String(id) !== String(p.id)));
      await refreshProducts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not remove from flash sale."));
    } finally {
      setFlashUpdating(false);
    }
  };

  const startEditFlash = (product) => {
    setFlashEditId(String(product.id));
    setFlashEditSalePrice(product?.price != null ? String(product.price) : "");
    setFlashEditOriginalPrice(product?.originalPrice != null ? String(product.originalPrice) : "");
  };

  const cancelEditFlash = () => {
    setFlashEditId(null);
    setFlashEditSalePrice("");
    setFlashEditOriginalPrice("");
  };

  const saveEditFlash = async () => {
    if (flashUpdating) return;
    if (!flashEditId) return;
    const sale = flashEditSalePrice === "" ? null : Number(flashEditSalePrice);
    const original = flashEditOriginalPrice === "" ? null : Number(flashEditOriginalPrice);
    if (sale == null || !Number.isFinite(sale) || sale < 0) {
      toast.warning("Enter a valid sale price.");
      return;
    }
    if (original != null && (!Number.isFinite(original) || original <= 0)) {
      toast.warning("Enter a valid original price or leave it empty.");
      return;
    }
    setFlashUpdating(true);
    try {
      await api.put(`/products/${flashEditId}`, { status: "flash", price: sale, originalPrice: original });
      toast.success("Flash product updated.");
      cancelEditFlash();
      await refreshProducts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not update product."));
    } finally {
      setFlashUpdating(false);
    }
  };

  const toggleFlashSelect = (id) => {
    const sid = String(id);
    setFlashSelectedIds((cur) => {
      const arr = Array.isArray(cur) ? cur.map(String) : [];
      return arr.includes(sid) ? arr.filter((x) => x !== sid) : [...arr, sid];
    });
  };

  const toggleSelectAllFlashFiltered = () => {
    if (flashProductsFiltered.length === 0) return;
    const filtered = new Set(flashProductsFiltered.map((p) => String(p.id)));
    const allSelected = flashProductsFiltered.every((p) => flashSelectedSet.has(String(p.id)));
    if (allSelected) {
      setFlashSelectedIds((cur) => (Array.isArray(cur) ? cur.filter((id) => !filtered.has(String(id))) : []));
      return;
    }
    const next = new Set((flashSelectedIds || []).map(String));
    for (const id of filtered) next.add(String(id));
    setFlashSelectedIds(Array.from(next));
  };

  const applyFlashBulkDiscount = async () => {
    if (flashUpdating) return;
    if (!settings.flashSaleEnabled) {
      toast.warning("Flash sale is disabled. Enable it first.");
      return;
    }
    if (!Array.isArray(flashSelectedIds) || flashSelectedIds.length === 0) {
      toast.warning("Select products first.");
      return;
    }
    const percent = Number(flashBulkDiscountPercent);
    if (!Number.isFinite(percent) || percent <= 0) {
      toast.warning("Enter a valid discount percent.");
      return;
    }
    setFlashUpdating(true);
    try {
      const byId = new Map((Array.isArray(productsCatalog) ? productsCatalog : []).map((p) => [String(p.id), p]));
      const targets = flashSelectedIds.map((id) => byId.get(String(id))).filter(Boolean);
      await Promise.all(
        targets.map((p) => {
          const base = p.originalPrice ?? p.price;
          const discounted = computeDiscountedPrice(base, percent);
          if (discounted == null || base == null) return Promise.resolve();
          return api.put(`/products/${p.id}`, { status: "flash", originalPrice: Number(base), price: discounted });
        })
      );
      toast.success("Discount applied.");
      await refreshProducts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not apply discount."));
    } finally {
      setFlashUpdating(false);
    }
  };

  const bulkRemoveFlash = async () => {
    if (flashUpdating) return;
    if (!Array.isArray(flashSelectedIds) || flashSelectedIds.length === 0) {
      toast.warning("Select products first.");
      return;
    }
    setFlashUpdating(true);
    try {
      const byId = new Map((Array.isArray(productsCatalog) ? productsCatalog : []).map((p) => [String(p.id), p]));
      const targets = flashSelectedIds.map((id) => byId.get(String(id))).filter(Boolean);
      await Promise.all(
        targets.map((p) => {
          const payload = { status: "active" };
          if (flashRestoreOnRemove && p.originalPrice != null && Number.isFinite(Number(p.originalPrice))) {
            payload.price = Number(p.originalPrice);
            payload.originalPrice = null;
          }
          return api.put(`/products/${p.id}`, payload);
        })
      );
      toast.success("Removed selected from flash sale.");
      setFlashSelectedIds([]);
      await refreshProducts();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not remove all selected."));
    } finally {
      setFlashUpdating(false);
    }
  };

  // --- State for all settings ---
  const [settings, setSettings] = useState({
    // General
    siteName: "",
    siteTitle: "",
    adminEmail: "",
    supportPhone: "",
    timezone: "",
    dateFormat: "",
    maintenanceMode: false,

    // Store
    storeAddress: "",
    storeMap: "",
    defaultCurrency: "",
    currencySymbol: "",
    minOrderAmount: "",
    codEnabled: false,
    guestCheckout: false,

    // Logo
    logoPreview: "",
    faviconPreview: "",
    adminLogoPreview: "",
    loaderPreview: "",
    primaryColor: "",
    secondaryColor: "",

    // SEO
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    ogImagePreview: "",
    googleVerify: "",
    robotsTxt: "",
    sitemapEnabled: false,

    // Payment
    sslcommerzEnabled: false,
    sslcommerzKey: "",
    sslcommerzSecret: "",
    sslcommerzSandbox: false,
    stripeEnabled: false,
    stripeKey: "",
    stripeSecret: "",
    stripeSandbox: false,
    paypalEnabled: false,
    bkashEnabled: false,
    bkashKey: "",
    bkashSecret: "",
    bkashSandbox: false,
    nagadEnabled: false,
    rocketEnabled: false,
    codEnabledPayment: false,

    // Wallet
    walletEnabled: false,
    minRecharge: "",
    cashbackPercent: "",
    referralBonus: "",
    walletExpireDays: "",
    autoRefund: false,

    // Flash Sale
    flashSaleEnabled: false,
    flashTimer: "",
    productLimit: "",
    autoExpire: false,
    homepageFlash: false,

    // Shipping
    deliveryZones: "",
    shippingCharge: "",
    freeShippingLimit: "",
    estDeliveryTime: "",
    deliveryPartner: "",

    // Tax
    vatPercent: "",
    taxEnabled: false,
    invoicePrefix: "",
    invoiceFooter: "",
    autoInvoice: false,

    // Order
    autoConfirm: false,
    autoCancelHours: "",
    returnDays: "",
    autoSendInvoice: false,

    // Product
    productApproval: false,
    stockWarning: "",
    skuAuto: false,
    productReview: false,
    relatedProduct: false,

    // Variation
    colorEnabled: false,
    sizeEnabled: false,
    unitEnabled: false,
    dynamicVariation: false,

    // Customer
    registrationEnabled: false,
    otpVerify: false,
    customerWallet: false,
    rewardPoints: false,
    guestControl: false,

    // Notification
    pushEnabled: false,
    orderNotify: false,
    deliveryNotify: false,
    promoNotify: false,

    // Email
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    mailEncrypt: "",

    // SMS
    smsProvider: "",
    smsApiKey: "",
    senderId: "",
    otpSms: false,

    // Landing
    heroSlider: false,
    featuredProduct: false,
    dynamicSort: false,

    // Products Set
    featuredProducts: [],
    newArrivals: [],
    bestSelling: [],

    // Banner
    homeBannerPreview: "",
    offerBannerPreview: "",
    popupBannerPreview: "",
    bannerActive: false,
    bannerSchedule: "",

    // Coupon
    couponAutoApply: false,
    couponLimit: "",
    firstOrderCoupon: false,
    referralCoupon: false,
    flashCoupon: false,

    // Auth
    googleLogin: false,
    facebookLogin: false,
    jwtExpire: "",
    loginAttempts: "",
    twoFactor: false,

    // Staff
    adminRole: "",
    staffRole: "",

    // Social
    facebook: "",
    instagram: "",
    youtube: "",
    tiktok: "",
    whatsapp: "",

    // Chat
    liveChat: false,
    messenger: false,
    whatsappChat: false,
    ticketSystem: false,

    // Backup
    autoBackup: "",

    // Maintenance
    cacheClear: false,
    debugMode: false,

    // API
    googleAnalytics: "",
    fbPixel: "",
    firebaseConfig: "",

    // Theme
    darkMode: false,
    sidebarStyle: "",
    themeColor: "",
    fontFamily: "",

    // Language
    multiLang: false,
    currencyRate: "",
    rtlSupport: false,

    // Analytics
    visitorTrack: false,
    salesTrack: false,
    conversionTrack: false,
    heatmap: false,

    // Advanced
    cronJob: "",
    queueSystem: false,
    redisCache: false,
    devMode: false,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const flashLimit = useMemo(() => {
    const n = settings?.productLimit === "" || settings?.productLimit == null ? null : Number(settings.productLimit);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [settings?.productLimit]);

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });

  const onPickImage = (key) => async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateSetting(key, dataUrl);
    } catch {
      toast.error("Image upload failed.");
    }
  };

  const showModal = (title, content, onConfirm) => {
    setModalConfig({ title, content, onConfirm });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (settingsSaving) return;
    setSettingsSaving(true);
    try {
      const toId = (x) => x?._id ?? x?.id ?? x;
      const payload = {
        ...settings,
        featuredProducts: (settings.featuredProducts || []).map(toId).filter(Boolean),
        newArrivals: (settings.newArrivals || []).map(toId).filter(Boolean),
        bestSelling: (settings.bestSelling || []).map(toId).filter(Boolean),
      };
      const res = await api.put("/settings", payload);
      const data = res?.data && typeof res.data === "object" ? res.data : {};
      setSettings((prev) => ({
        ...prev,
        ...data,
        featuredProducts: Array.isArray(data.featuredProducts) ? data.featuredProducts : (prev.featuredProducts || []),
        newArrivals: Array.isArray(data.newArrivals) ? data.newArrivals : (prev.newArrivals || []),
        bestSelling: Array.isArray(data.bestSelling) ? data.bestSelling : (prev.bestSelling || []),
      }));
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const filteredGroups = sidebarGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  // --- Settings Page Components ---

  const GeneralSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="General Settings" subtitle="Configure basic site information and preferences" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Site Information" icon="🌐">
          <InputField label="Site Name" value={settings.siteName} onChange={(v) => updateSetting("siteName", v)} />
          <InputField label="Site Title" value={settings.siteTitle} onChange={(v) => updateSetting("siteTitle", v)} />
          <InputField label="Admin Email" type="email" value={settings.adminEmail} onChange={(v) => updateSetting("adminEmail", v)} />
          <InputField label="Support Phone" value={settings.supportPhone} onChange={(v) => updateSetting("supportPhone", v)} />
        </Card>
        <Card title="Regional Settings" icon="🌍">
          <SelectField 
            label="Timezone" 
            value={settings.timezone} 
            onChange={(v) => updateSetting("timezone", v)}
            options={[{value:"Asia/Dhaka", label:"Asia/Dhaka (BST)"}, {value:"UTC", label:"UTC"}]}
          />
          <SelectField 
            label="Date Format" 
            value={settings.dateFormat} 
            onChange={(v) => updateSetting("dateFormat", v)}
            options={[{value:"DD/MM/YYYY", label:"DD/MM/YYYY"}, {value:"MM/DD/YYYY", label:"MM/DD/YYYY"}, {value:"YYYY-MM-DD", label:"YYYY-MM-DD"}]}
          />
        </Card>
      </div>
      <Card title="System Mode" icon="🔒">
        <Toggle 
          label="Maintenance Mode" 
          description="Enable to show maintenance page to visitors"
          checked={settings.maintenanceMode} 
          onChange={(v) => updateSetting("maintenanceMode", v)} 
        />
      </Card>
    </div>
  );

  const StoreSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Store Settings" subtitle="Manage your physical store and currency preferences" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Store Location" icon="📍">
          <TextArea label="Store Address" value={settings.storeAddress} onChange={(v) => updateSetting("storeAddress", v)} rows={3} />
          <FileUpload label="Store Location Map" preview={settings.storeMap} onChange={onPickImage("storeMap")} />
        </Card>
        <Card title="Currency & Checkout" icon="💰">
          <SelectField label="Default Currency" value={settings.defaultCurrency} onChange={(v) => updateSetting("defaultCurrency", v)} 
            options={[{value:"BDT", label:"Bangladeshi Taka (BDT)"}, {value:"USD", label:"US Dollar (USD)"}]} />
          <InputField label="Currency Symbol" value={settings.currencySymbol} onChange={(v) => updateSetting("currencySymbol", v)} />
          <InputField label="Minimum Order Amount" type="number" value={settings.minOrderAmount} onChange={(v) => updateSetting("minOrderAmount", v)} />
          <Toggle label="Cash On Delivery" checked={settings.codEnabled} onChange={(v) => updateSetting("codEnabled", v)} />
          <Toggle label="Guest Checkout" description="Allow customers to checkout without registration" checked={settings.guestCheckout} onChange={(v) => updateSetting("guestCheckout", v)} />
        </Card>
      </div>
    </div>
  );

  const LogoBranding = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Logo & Branding" subtitle="Upload brand assets and customize colors" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Brand Assets" icon="🖼️">
          <div className="grid grid-cols-2 gap-4">
            <FileUpload label="Site Logo" preview={settings.logoPreview} onChange={onPickImage("logoPreview")} />
            <FileUpload label="Favicon" preview={settings.faviconPreview} onChange={onPickImage("faviconPreview")} />
            <FileUpload label="Admin Logo" preview={settings.adminLogoPreview} onChange={onPickImage("adminLogoPreview")} />
            <FileUpload label="Loader Icon" preview={settings.loaderPreview} onChange={onPickImage("loaderPreview")} />
          </div>
        </Card>
        <Card title="Brand Colors" icon="🎨">
          <ColorPicker label="Primary Color" value={settings.primaryColor} onChange={(v) => updateSetting("primaryColor", v)} />
          <ColorPicker label="Secondary Color" value={settings.secondaryColor} onChange={(v) => updateSetting("secondaryColor", v)} />
          <div className="mt-4 p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10">
            <h4 className="text-sm font-semibold text-white/80 mb-3">Live Preview</h4>
            <div className="space-y-2">
              <div className="h-10 rounded-lg" style={{ backgroundColor: settings.primaryColor }} />
              <div className="h-10 rounded-lg" style={{ backgroundColor: settings.secondaryColor }} />
              <Button>Sample Button</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const SEOSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="SEO Settings" subtitle="Optimize your site for search engines" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Meta Information" icon="🔍">
          <InputField label="Meta Title" value={settings.metaTitle} onChange={(v) => updateSetting("metaTitle", v)} />
          <TextArea label="Meta Description" value={settings.metaDescription} onChange={(v) => updateSetting("metaDescription", v)} rows={3} />
          <TextArea label="Meta Keywords" value={settings.metaKeywords} onChange={(v) => updateSetting("metaKeywords", v)} rows={2} />
        </Card>
        <Card title="Advanced SEO" icon="📈">
          <FileUpload label="OG Image" preview={settings.ogImagePreview} onChange={onPickImage("ogImagePreview")} />
          <InputField label="Google Verification Code" value={settings.googleVerify} onChange={(v) => updateSetting("googleVerify", v)} />
          <Toggle label="Sitemap Auto-Generate" checked={settings.sitemapEnabled} onChange={(v) => updateSetting("sitemapEnabled", v)} />
        </Card>
      </div>
      <Card title="Robots.txt Editor" icon="🤖">
        <TextArea label="Robots.txt Content" value={settings.robotsTxt} onChange={(v) => updateSetting("robotsTxt", v)} rows={6} />
      </Card>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Payment Settings" subtitle="Configure payment gateways for Bangladesh" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { id: "sslcommerz", name: "SSLCommerz", icon: "🔒", color: "from-purple-400 to-purple-600" },
          { id: "stripe", name: "Stripe", icon: "💳", color: "from-blue-400 to-blue-600" },
          { id: "paypal", name: "PayPal", icon: "🅿️", color: "from-blue-500 to-blue-700" },
          { id: "bkash", name: "bKash", icon: "📱", color: "from-pink-400 to-pink-600" },
          { id: "nagad", name: "Nagad", icon: "💰", color: "from-orange-400 to-red-500" },
          { id: "rocket", name: "Rocket", icon: "🚀", color: "from-blue-400 to-indigo-500" },
        ].map((gateway) => (
          <Card key={gateway.id} title={gateway.name} icon={gateway.icon}>
            <Toggle 
              label={`Enable ${gateway.name}`} 
              checked={settings[`${gateway.id}Enabled`]} 
              onChange={(v) => updateSetting(`${gateway.id}Enabled`, v)} 
            />
            {settings[`${gateway.id}Enabled`] && (
              <div className="space-y-3 mt-3 pt-3 border-t border-white/10">
                <InputField label="API Key" value={settings[`${gateway.id}Key`]} onChange={(v) => updateSetting(`${gateway.id}Key`, v)} />
                <InputField label="Secret Key" type="password" value={settings[`${gateway.id}Secret`]} onChange={(v) => updateSetting(`${gateway.id}Secret`, v)} />
                <Toggle label="Sandbox Mode" checked={settings[`${gateway.id}Sandbox`]} onChange={(v) => updateSetting(`${gateway.id}Sandbox`, v)} />
              </div>
            )}
          </Card>
        ))}
        <Card title="Cash On Delivery" icon="💵">
          <Toggle label="Enable COD" checked={settings.codEnabledPayment} onChange={(v) => updateSetting("codEnabledPayment", v)} />
        </Card>
      </div>
    </div>
  );

  const WalletSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Wallet Settings" subtitle="Configure customer wallet and cashback system" />
      <Card title="Wallet Configuration" icon="👛">
        <Toggle label="Enable Wallet System" checked={settings.walletEnabled} onChange={(v) => updateSetting("walletEnabled", v)} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <InputField label="Minimum Recharge (৳)" type="number" value={settings.minRecharge} onChange={(v) => updateSetting("minRecharge", v)} />
          <InputField label="Cashback Percentage (%)" type="number" value={settings.cashbackPercent} onChange={(v) => updateSetting("cashbackPercent", v)} />
          <InputField label="Referral Bonus (৳)" type="number" value={settings.referralBonus} onChange={(v) => updateSetting("referralBonus", v)} />
          <InputField label="Wallet Expire Days" type="number" value={settings.walletExpireDays} onChange={(v) => updateSetting("walletExpireDays", v)} />
        </div>
        <div className="mt-4">
          <Toggle label="Auto Refund to Wallet" description="Refund cancelled orders automatically to wallet" checked={settings.autoRefund} onChange={(v) => updateSetting("autoRefund", v)} />
        </div>
      </Card>
    </div>
  );

  const FlashSaleSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Flash Sale Settings" subtitle="Configure flash sale settings and manage flash products" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Flash Sale Configuration" icon="⚡" className="lg:col-span-1">
          <Toggle
            label="Enable Flash Sale"
            checked={settings.flashSaleEnabled}
            onChange={(v) => updateSetting("flashSaleEnabled", v)}
          />
          <div className="grid grid-cols-1 gap-4 mt-4">
            <InputField
              label="Timer Duration (Hours)"
              type="number"
              value={settings.flashTimer}
              onChange={(v) => updateSetting("flashTimer", v)}
            />
            <InputField
              label="Product Limit"
              type="number"
              value={settings.productLimit}
              onChange={(v) => updateSetting("productLimit", v)}
            />
          </div>
          <div className="mt-4 space-y-3">
            <Toggle
              label="Auto Expire Flash Sales"
              checked={settings.autoExpire}
              onChange={(v) => updateSetting("autoExpire", v)}
            />
            <Toggle
              label="Show on Homepage"
              checked={settings.homepageFlash}
              onChange={(v) => updateSetting("homepageFlash", v)}
            />
          </div>
        </Card>

        <Card title="Add Products to Flash Sale" icon="🛒" className="lg:col-span-2 overflow-visible relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-white/90 mb-2">Search product</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={flashAddQuery}
                  onChange={(e) => setFlashAddQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50 pr-20"
                />
                <div className="absolute right-4 top-3.5 flex items-center gap-2">
                  {flashAddQuery && (
                    <button
                      type="button"
                      onClick={() => setFlashAddQuery("")}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                  <span className="text-white/40">🔍</span>
                </div>

                {!productsCatalogLoading && !productsCatalogError && flashAddQuery.trim() && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#2d0c2d] rounded-xl border border-white/15 shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto">
                    {flashCandidates.length > 0 ? (
                      flashCandidates.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addFlashProduct(p)}
                          disabled={flashUpdating}
                          className="w-full text-left flex items-center justify-between gap-4 p-3 hover:bg-white/10 border-b border-white/10 last:border-b-0 disabled:opacity-60"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {renderProductThumb(p)}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{p.name}</p>
                              <p className="text-xs text-white/50">
                                {p.price != null ? `৳${p.price}` : "—"}
                                {p.sku ? ` • ${p.sku}` : ""}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-white/70">Add</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-white/60">No products found.</div>
                    )}
                  </div>
                )}
              </div>
              {productsCatalogLoading ? <div className="text-sm text-white/50 mt-3">Loading products...</div> : null}
              {productsCatalogError ? (
                <div className="flex items-center justify-between gap-3 p-3 bg-red-500/10 border border-red-400/20 rounded-xl mt-3">
                  <div className="text-sm text-red-200">{productsCatalogError}</div>
                  <Button variant="secondary" onClick={() => fetchProductsCatalog({ force: true })} className="whitespace-nowrap">
                    Retry
                  </Button>
                </div>
              ) : null}
              {!settings.flashSaleEnabled ? (
                <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-sm text-amber-100 mt-3">
                  Flash sale is disabled. Enable it first to add products.
                </div>
              ) : null}
              {flashLimit != null && flashProducts.length >= flashLimit ? (
                <div className="p-3 bg-amber-500/10 border border-amber-400/20 rounded-xl text-sm text-amber-100 mt-3">
                  Flash sale product limit reached. Increase limit or remove products.
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <InputField
                label="Discount (%)"
                type="number"
                value={flashAddDiscountPercent}
                onChange={(v) => setFlashAddDiscountPercent(v)}
                placeholder="e.g. 25"
              />
              <Toggle
                label="Auto set original price"
                description="If original price is empty, set it from current price"
                checked={flashAutoSetOriginal}
                onChange={setFlashAutoSetOriginal}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card title="Active Flash Products" icon="🔥" className="overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="Search inside flash sale..."
              value={flashSearchQuery}
              onChange={(e) => setFlashSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
            <span className="absolute right-4 top-2.5 text-white/40">🔍</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <span className="text-sm text-white/50 whitespace-nowrap">
              <span className="text-orange-300 font-bold">{Array.isArray(flashSelectedIds) ? flashSelectedIds.length : 0}</span> selected
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={flashBulkDiscountPercent}
                onChange={(e) => setFlashBulkDiscountPercent(e.target.value)}
                placeholder="Discount %"
                className="w-36 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <Button variant="secondary" onClick={applyFlashBulkDiscount} className="whitespace-nowrap">
                Apply
              </Button>
            </div>
            <Button variant="danger" onClick={bulkRemoveFlash} className="whitespace-nowrap">
              Remove
            </Button>
          </div>
        </div>

        <Toggle
          label="Restore original price when removing"
          description="When removing a product from flash sale, set price = original price and clear original price"
          checked={flashRestoreOnRemove}
          onChange={setFlashRestoreOnRemove}
        />

        {flashProductsFiltered.length === 0 ? (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm">
            No flash sale products found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-3 py-3 text-left w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAllFlashFiltered}
                      className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                        flashProductsFiltered.every((p) => flashSelectedSet.has(String(p.id)))
                          ? "bg-gradient-to-r from-orange-300 to-green-400 border-transparent"
                          : "border-white/30 hover:border-orange-300"
                      }`}
                    >
                      {flashProductsFiltered.every((p) => flashSelectedSet.has(String(p.id))) ? (
                        <span className="text-[#1a0510] text-[10px] font-black">✓</span>
                      ) : null}
                    </button>
                  </th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Product</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Price</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Discount</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wider text-white/50 font-semibold">Stock</th>
                  <th className="px-3 py-3 text-left text-xs uppercase tracking-wider text-white/50 font-semibold w-56">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flashProductsFiltered.map((p) => {
                  const o = Number(p.originalPrice);
                  const s = Number(p.price);
                  const pct =
                    Number.isFinite(o) && Number.isFinite(s) && o > 0 && s < o ? Math.round((1 - s / o) * 100) : null;
                  const isEditing = flashEditId != null && String(flashEditId) === String(p.id);
                  return (
                    <tr key={p.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => toggleFlashSelect(p.id)}
                          className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                            flashSelectedSet.has(String(p.id))
                              ? "bg-gradient-to-r from-orange-300 to-green-400 border-transparent"
                              : "border-white/30 hover:border-orange-300"
                          }`}
                        >
                          {flashSelectedSet.has(String(p.id)) ? <span className="text-[#1a0510] text-[10px] font-black">✓</span> : null}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {renderProductThumb(p)}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                            <p className="text-xs text-white/50">{p.sku || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="number"
                              value={flashEditSalePrice}
                              onChange={(e) => setFlashEditSalePrice(e.target.value)}
                              placeholder="Sale"
                              className="w-28 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                            />
                            <input
                              type="number"
                              value={flashEditOriginalPrice}
                              onChange={(e) => setFlashEditOriginalPrice(e.target.value)}
                              placeholder="Original"
                              className="w-28 px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            {p.originalPrice != null ? (
                              <span className="text-xs text-white/40 line-through">৳{p.originalPrice}</span>
                            ) : null}
                            <span className="font-bold text-green-300">৳{p.price ?? "—"}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        {pct != null ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-orange-300/15 text-orange-200 border border-orange-300/20">
                            -{pct}%
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-white/60">{p.stock ?? "—"}</td>
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={cancelEditFlash} className="px-4 py-2">
                              Cancel
                            </Button>
                            <Button onClick={saveEditFlash} className="px-4 py-2">
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={() => startEditFlash(p)} className="px-4 py-2">
                              Edit
                            </Button>
                            <Button variant="danger" onClick={() => removeFlashProduct(p.id)} className="px-4 py-2">
                              Remove
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );

  const ShippingSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Shipping & Delivery" subtitle="Configure delivery zones and charges" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Delivery Configuration" icon="🚚">
          <TextArea label="Delivery Zones" value={settings.deliveryZones} onChange={(v) => updateSetting("deliveryZones", v)} rows={3} />
          <InputField label="Default Shipping Charge (৳)" type="number" value={settings.shippingCharge} onChange={(v) => updateSetting("shippingCharge", v)} />
          <InputField label="Free Shipping Above (৳)" type="number" value={settings.freeShippingLimit} onChange={(v) => updateSetting("freeShippingLimit", v)} />
        </Card>
        <Card title="Delivery Partners" icon="🤝">
          <InputField label="Estimated Delivery Time" value={settings.estDeliveryTime} onChange={(v) => updateSetting("estDeliveryTime", v)} />
          <SelectField label="Primary Delivery Partner" value={settings.deliveryPartner} onChange={(v) => updateSetting("deliveryPartner", v)}
            options={[{value:"Pathao", label:"Pathao"}, {value:"RedX", label:"RedX"}, {value:"Paperfly", label:"Paperfly"}, {value:"eCourier", label:"eCourier"}]} />
        </Card>
      </div>
    </div>
  );

  const TaxSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Tax & Invoice" subtitle="Configure VAT and invoice settings" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Tax Configuration" icon="📊">
          <Toggle label="Enable Tax/VAT" checked={settings.taxEnabled} onChange={(v) => updateSetting("taxEnabled", v)} />
          <InputField label="VAT Percentage (%)" type="number" value={settings.vatPercent} onChange={(v) => updateSetting("vatPercent", v)} />
        </Card>
        <Card title="Invoice Settings" icon="📄">
          <InputField label="Invoice Prefix" value={settings.invoicePrefix} onChange={(v) => updateSetting("invoicePrefix", v)} />
          <TextArea label="Invoice Footer Text" value={settings.invoiceFooter} onChange={(v) => updateSetting("invoiceFooter", v)} rows={2} />
          <Toggle label="Auto Generate Invoice" checked={settings.autoInvoice} onChange={(v) => updateSetting("autoInvoice", v)} />
        </Card>
      </div>
    </div>
  );

  const OrderSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Order Settings" subtitle="Configure order flow and automation" />
      <Card title="Order Automation" icon="⚙️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Auto Confirm Order" checked={settings.autoConfirm} onChange={(v) => updateSetting("autoConfirm", v)} />
          <InputField label="Auto Cancel Pending (Hours)" type="number" value={settings.autoCancelHours} onChange={(v) => updateSetting("autoCancelHours", v)} />
          <InputField label="Return Request Days" type="number" value={settings.returnDays} onChange={(v) => updateSetting("returnDays", v)} />
          <Toggle label="Auto Send Invoice" checked={settings.autoSendInvoice} onChange={(v) => updateSetting("autoSendInvoice", v)} />
        </div>
      </Card>
    </div>
  );

  const ProductSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Product Settings" subtitle="Configure product behavior and reviews" />
      <Card title="Product Behavior" icon="🛍️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Product Approval System" description="Require admin approval for new products" checked={settings.productApproval} onChange={(v) => updateSetting("productApproval", v)} />
          <InputField label="Stock Warning Quantity" type="number" value={settings.stockWarning} onChange={(v) => updateSetting("stockWarning", v)} />
          <Toggle label="Auto Generate SKU" checked={settings.skuAuto} onChange={(v) => updateSetting("skuAuto", v)} />
          <Toggle label="Enable Product Reviews" checked={settings.productReview} onChange={(v) => updateSetting("productReview", v)} />
          <Toggle label="Show Related Products" checked={settings.relatedProduct} onChange={(v) => updateSetting("relatedProduct", v)} />
        </div>
      </Card>
    </div>
  );

  const VariationSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Variation Settings" subtitle="Manage product variations and attributes" />
      <Card title="Global Variation Types" icon="🎨">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Color Variation" checked={settings.colorEnabled} onChange={(v) => updateSetting("colorEnabled", v)} />
          <Toggle label="Size Variation" checked={settings.sizeEnabled} onChange={(v) => updateSetting("sizeEnabled", v)} />
          <Toggle label="Unit Variation" checked={settings.unitEnabled} onChange={(v) => updateSetting("unitEnabled", v)} />
          <Toggle label="Dynamic Variation Generator" checked={settings.dynamicVariation} onChange={(v) => updateSetting("dynamicVariation", v)} />
        </div>
      </Card>
    </div>
  );

  const CustomerSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Customer Settings" subtitle="Manage customer registration and verification" />
      <Card title="Customer Configuration" icon="👤">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Enable Registration" checked={settings.registrationEnabled} onChange={(v) => updateSetting("registrationEnabled", v)} />
          <Toggle label="OTP Verification" checked={settings.otpVerify} onChange={(v) => updateSetting("otpVerify", v)} />
          <Toggle label="Customer Wallet" checked={settings.customerWallet} onChange={(v) => updateSetting("customerWallet", v)} />
          <Toggle label="Reward Points" checked={settings.rewardPoints} onChange={(v) => updateSetting("rewardPoints", v)} />
          <Toggle label="Guest User Control" checked={settings.guestControl} onChange={(v) => updateSetting("guestControl", v)} />
        </div>
      </Card>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Notification Settings" subtitle="Configure push and system notifications" />
      <Card title="Notification Toggles" icon="🔔">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Push Notifications" checked={settings.pushEnabled} onChange={(v) => updateSetting("pushEnabled", v)} />
          <Toggle label="Order Notifications" checked={settings.orderNotify} onChange={(v) => updateSetting("orderNotify", v)} />
          <Toggle label="Delivery Notifications" checked={settings.deliveryNotify} onChange={(v) => updateSetting("deliveryNotify", v)} />
          <Toggle label="Promotional Notifications" checked={settings.promoNotify} onChange={(v) => updateSetting("promoNotify", v)} />
        </div>
      </Card>
    </div>
  );

  const EmailSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Email Settings" subtitle="Configure SMTP for transactional emails" />
      <Card title="SMTP Configuration" icon="📧">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="SMTP Host" value={settings.smtpHost} onChange={(v) => updateSetting("smtpHost", v)} />
          <InputField label="SMTP Port" value={settings.smtpPort} onChange={(v) => updateSetting("smtpPort", v)} />
          <InputField label="SMTP Username" value={settings.smtpUser} onChange={(v) => updateSetting("smtpUser", v)} />
          <InputField label="SMTP Password" type="password" value={settings.smtpPass} onChange={(v) => updateSetting("smtpPass", v)} />
          <SelectField label="Mail Encryption" value={settings.mailEncrypt} onChange={(v) => updateSetting("mailEncrypt", v)}
            options={[{value:"TLS", label:"TLS"}, {value:"SSL", label:"SSL"}, {value:"None", label:"None"}]} />
        </div>
        <div className="mt-4">
          <Button>Send Test Email</Button>
        </div>
      </Card>
    </div>
  );

  const SMSSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="SMS Settings" subtitle="Configure SMS gateway for OTP and alerts" />
      <Card title="SMS Configuration" icon="📱">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField label="SMS Provider" value={settings.smsProvider} onChange={(v) => updateSetting("smsProvider", v)}
            options={[{value:"Twilio", label:"Twilio"}, {value:"MessageBird", label:"MessageBird"}, {value:"BD SMS", label:"BD SMS Gateway"}]} />
          <InputField label="API Key" value={settings.smsApiKey} onChange={(v) => updateSetting("smsApiKey", v)} />
          <InputField label="Sender ID" value={settings.senderId} onChange={(v) => updateSetting("senderId", v)} />
          <Toggle label="OTP SMS" checked={settings.otpSms} onChange={(v) => updateSetting("otpSms", v)} />
        </div>
      </Card>
    </div>
  );

  const LandingSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Landing Page Settings" subtitle="Build and customize homepage sections" />
      <Card title="Homepage Builder" icon="🏗️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Hero Slider" checked={settings.heroSlider} onChange={(v) => updateSetting("heroSlider", v)} />
          <Toggle label="Featured Product Section" checked={settings.featuredProduct} onChange={(v) => updateSetting("featuredProduct", v)} />
          <Toggle label="Dynamic Section Sorting" checked={settings.dynamicSort} onChange={(v) => updateSetting("dynamicSort", v)} />
        </div>
      </Card>
    </div>
  );

  const BannerSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Banner Management" subtitle="Upload and schedule promotional banners" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Banner Uploads" icon="🖼️">
          <FileUpload label="Homepage Banner" preview={settings.homeBannerPreview} onChange={onPickImage("homeBannerPreview")} />
          <FileUpload label="Offer Banner" preview={settings.offerBannerPreview} onChange={onPickImage("offerBannerPreview")} />
          <FileUpload label="Popup Banner" preview={settings.popupBannerPreview} onChange={onPickImage("popupBannerPreview")} />
        </Card>
        <Card title="Banner Controls" icon="⚙️">
          <Toggle label="Banner Active" checked={settings.bannerActive} onChange={(v) => updateSetting("bannerActive", v)} />
          <InputField label="Banner Schedule" type="datetime-local" value={settings.bannerSchedule} onChange={(v) => updateSetting("bannerSchedule", v)} />
        </Card>
      </div>
    </div>
  );

  const CouponSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Coupon Settings" subtitle="Configure coupon behavior and limits" />
      <Card title="Coupon Configuration" icon="🏷️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Auto Apply Coupon" checked={settings.couponAutoApply} onChange={(v) => updateSetting("couponAutoApply", v)} />
          <InputField label="Usage Limit Per User" type="number" value={settings.couponLimit} onChange={(v) => updateSetting("couponLimit", v)} />
          <Toggle label="First Order Coupon" checked={settings.firstOrderCoupon} onChange={(v) => updateSetting("firstOrderCoupon", v)} />
          <Toggle label="Referral Coupon" checked={settings.referralCoupon} onChange={(v) => updateSetting("referralCoupon", v)} />
          <Toggle label="Flash Coupon" checked={settings.flashCoupon} onChange={(v) => updateSetting("flashCoupon", v)} />
        </div>
      </Card>
    </div>
  );

  const AuthSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Auth & Security" subtitle="Configure authentication methods" />
      <Card title="Authentication" icon="🔐">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Google Login" checked={settings.googleLogin} onChange={(v) => updateSetting("googleLogin", v)} />
          <Toggle label="Facebook Login" checked={settings.facebookLogin} onChange={(v) => updateSetting("facebookLogin", v)} />
          <InputField label="JWT Expire (Hours)" type="number" value={settings.jwtExpire} onChange={(v) => updateSetting("jwtExpire", v)} />
          <InputField label="Max Login Attempts" type="number" value={settings.loginAttempts} onChange={(v) => updateSetting("loginAttempts", v)} />
          <Toggle label="Two Factor Authentication" checked={settings.twoFactor} onChange={(v) => updateSetting("twoFactor", v)} />
        </div>
      </Card>
    </div>
  );

  const StaffSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Staff & Roles" subtitle="Manage admin and staff permissions" />
      <Card title="Role Configuration" icon="🛡️">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Admin Role Name" value={settings.adminRole} onChange={(v) => updateSetting("adminRole", v)} />
          <InputField label="Staff Role Name" value={settings.staffRole} onChange={(v) => updateSetting("staffRole", v)} />
        </div>
      </Card>
    </div>
  );

  const SocialSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Social Media Settings" subtitle="Connect your social media profiles" />
      <Card title="Social Links" icon="🌐">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Facebook URL" icon="📘" value={settings.facebook} onChange={(v) => updateSetting("facebook", v)} />
          <InputField label="Instagram URL" icon="📸" value={settings.instagram} onChange={(v) => updateSetting("instagram", v)} />
          <InputField label="YouTube URL" icon="▶️" value={settings.youtube} onChange={(v) => updateSetting("youtube", v)} />
          <InputField label="TikTok URL" icon="🎵" value={settings.tiktok} onChange={(v) => updateSetting("tiktok", v)} />
          <InputField label="WhatsApp Number" icon="💬" value={settings.whatsapp} onChange={(v) => updateSetting("whatsapp", v)} />
        </div>
      </Card>
    </div>
  );

  const ChatSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Chat & Support" subtitle="Configure live chat and support systems" />
      <Card title="Support Configuration" icon="💬">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Live Chat" checked={settings.liveChat} onChange={(v) => updateSetting("liveChat", v)} />
          <Toggle label="Messenger Integration" checked={settings.messenger} onChange={(v) => updateSetting("messenger", v)} />
          <Toggle label="WhatsApp Chat Button" checked={settings.whatsappChat} onChange={(v) => updateSetting("whatsappChat", v)} />
          <Toggle label="Support Ticket System" checked={settings.ticketSystem} onChange={(v) => updateSetting("ticketSystem", v)} />
        </div>
      </Card>
    </div>
  );

  const BackupSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Backup & Database" subtitle="Manage backups and monitor database health" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Backup Controls" icon="💾">
          <Button onClick={() => showModal("Manual Backup", "Create a full database backup now?", () => toast.success("Backup started!"))}>Create Manual Backup</Button>
          <div className="mt-4">
            <SelectField label="Auto Backup Schedule" value={settings.autoBackup} onChange={(v) => updateSetting("autoBackup", v)}
              options={[{value:"hourly", label:"Hourly"}, {value:"daily", label:"Daily"}, {value:"weekly", label:"Weekly"}, {value:"monthly", label:"Monthly"}]} />
          </div>
        </Card>
        <Card title="Database Status" icon="🗄️">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-sm text-white/60">Database Size</span>
              <span className="text-sm font-bold text-white">245 MB</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-sm text-white/60">Tables</span>
              <span className="text-sm font-bold text-white">42</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
              <span className="text-sm text-white/60">Last Backup</span>
              <span className="text-sm font-bold text-green-400">2 hours ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const MaintenanceSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="System Maintenance" subtitle="Clear cache and manage system logs" />
      <Card title="Maintenance Tools" icon="🔧">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="danger" onClick={() => showModal("Clear Cache", "This will clear all application cache. Continue?", () => toast.success("Cache cleared!"))}>Clear Cache</Button>
          <Button onClick={() => toast.success("System logs downloaded!")}>Download System Logs</Button>
          <Toggle label="Debug Mode" description="Enable detailed error reporting" checked={settings.debugMode} onChange={(v) => updateSetting("debugMode", v)} />
        </div>
      </Card>
    </div>
  );

  const APISettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="API & Integration" subtitle="Configure third-party integrations" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Analytics Integration" icon="📊">
          <InputField label="Google Analytics ID" value={settings.googleAnalytics} onChange={(v) => updateSetting("googleAnalytics", v)} />
          <InputField label="Facebook Pixel ID" value={settings.fbPixel} onChange={(v) => updateSetting("fbPixel", v)} />
        </Card>
        <Card title="Firebase Config" icon="🔥">
          <TextArea label="Firebase Configuration JSON" value={settings.firebaseConfig} onChange={(v) => updateSetting("firebaseConfig", v)} rows={5} />
        </Card>
      </div>
    </div>
  );

  const ThemeSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Theme & Appearance" subtitle="Customize admin panel look and feel" />
      <Card title="Theme Configuration" icon="✨">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Dark Mode" checked={settings.darkMode} onChange={(v) => updateSetting("darkMode", v)} />
          <SelectField label="Sidebar Style" value={settings.sidebarStyle} onChange={(v) => updateSetting("sidebarStyle", v)}
            options={[{value:"default", label:"Default"}, {value:"compact", label:"Compact"}, {value:"icon", label:"Icon Only"}]} />
          <SelectField label="Theme Color" value={settings.themeColor} onChange={(v) => updateSetting("themeColor", v)}
            options={[{value:"orange", label:"Orange"}, {value:"green", label:"Green"}, {value:"purple", label:"Purple"}, {value:"blue", label:"Blue"}]} />
          <SelectField label="Font Family" value={settings.fontFamily} onChange={(v) => updateSetting("fontFamily", v)}
            options={[{value:"Inter", label:"Inter"}, {value:"Poppins", label:"Poppins"}, {value:"Roboto", label:"Roboto"}]} />
        </div>
      </Card>
    </div>
  );

  const LanguageSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Language & Currency" subtitle="Configure multilingual support" />
      <Card title="Localization" icon="🌍">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Multi Language Support" checked={settings.multiLang} onChange={(v) => updateSetting("multiLang", v)} />
          <InputField label="Currency Exchange Rate" type="number" value={settings.currencyRate} onChange={(v) => updateSetting("currencyRate", v)} />
          <Toggle label="RTL Support" description="Right-to-left text direction" checked={settings.rtlSupport} onChange={(v) => updateSetting("rtlSupport", v)} />
        </div>
      </Card>
    </div>
  );

  const AnalyticsSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Analytics & Tracking" subtitle="Configure visitor and sales tracking" />
      <Card title="Tracking Configuration" icon="📈">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Toggle label="Visitor Tracking" checked={settings.visitorTrack} onChange={(v) => updateSetting("visitorTrack", v)} />
          <Toggle label="Sales Tracking" checked={settings.salesTrack} onChange={(v) => updateSetting("salesTrack", v)} />
          <Toggle label="Conversion Tracking" checked={settings.conversionTrack} onChange={(v) => updateSetting("conversionTrack", v)} />
          <Toggle label="Heatmap Integration" checked={settings.heatmap} onChange={(v) => updateSetting("heatmap", v)} />
        </div>
      </Card>
    </div>
  );

  const AdvancedSettings = () => (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader title="Advanced Settings" subtitle="Developer and system-level configurations" />
      <Card title="System Configuration" icon="🚀">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Cron Job Schedule" value={settings.cronJob} onChange={(v) => updateSetting("cronJob", v)} />
          <Toggle label="Queue System" checked={settings.queueSystem} onChange={(v) => updateSetting("queueSystem", v)} />
          <Toggle label="Redis Cache" checked={settings.redisCache} onChange={(v) => updateSetting("redisCache", v)} />
          <Toggle label="Developer Mode" description="Enable debug toolbar and detailed logs" checked={settings.devMode} onChange={(v) => updateSetting("devMode", v)} />
        </div>
      </Card>
    </div>
  );

  // --- Products Set Component ---
  const ProductsSetSettings = () => {
    const products = productsCatalog;
    const loading = productsCatalogLoading;
    const error = productsCatalogError;

    const addUnique = (key, product) => {
      const current = Array.isArray(settings[key]) ? settings[key] : [];
      const exists = current.some((p) => String(p.id) === String(product.id));
      if (!exists) updateSetting(key, [...current, product]);
    };

    const removeOne = (key, productId) => {
      const current = Array.isArray(settings[key]) ? settings[key] : [];
      updateSetting(key, current.filter((p) => String(p.id) !== String(productId)));
    };

    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="Products Set" subtitle="Manage featured, new arrivals and best selling products" />

        <ProductPicker
          title="Featured Products"
          icon="⭐"
          placeholder="Search products to add..."
          products={products}
          loading={loading}
          error={error}
          onRetry={() => fetchProductsCatalog({ force: true })}
          selected={Array.isArray(settings.featuredProducts) ? settings.featuredProducts : []}
          onAdd={(p) => addUnique("featuredProducts", p)}
          onRemove={(id) => removeOne("featuredProducts", id)}
        />

        <ProductPicker
          title="New Arrivals"
          icon="🆕"
          placeholder="Search products to add as new arrivals..."
          products={products}
          loading={loading}
          error={error}
          onRetry={() => fetchProductsCatalog({ force: true })}
          selected={Array.isArray(settings.newArrivals) ? settings.newArrivals : []}
          onAdd={(p) => addUnique("newArrivals", p)}
          onRemove={(id) => removeOne("newArrivals", id)}
        />

        <ProductPicker
          title="Best Selling"
          icon="🔥"
          placeholder="Search products to add as best selling..."
          products={products}
          loading={loading}
          error={error}
          onRetry={() => fetchProductsCatalog({ force: true })}
          selected={Array.isArray(settings.bestSelling) ? settings.bestSelling : []}
          onAdd={(p) => addUnique("bestSelling", p)}
          onRemove={(id) => removeOne("bestSelling", id)}
          defaultSort="sold_desc"
        />
      </div>
    );
  };

  // --- Tab Mapping ---
  const tabComponents = {
    general: GeneralSettings,
    store: StoreSettings,
    logo: LogoBranding,
    seo: SEOSettings,
    productsSet: ProductsSetSettings,
    payment: PaymentSettings,
    wallet: WalletSettings,
    flash: FlashSaleSettings,
    shipping: ShippingSettings,
    tax: TaxSettings,
    order: OrderSettings,
    product: ProductSettings,
    variation: VariationSettings,
    customer: CustomerSettings,
    notification: NotificationSettings,
    email: EmailSettings,
    sms: SMSSettings,
    landing: LandingSettings,
    banner: BannerSettings,
    coupon: CouponSettings,
    auth: AuthSettings,
    staff: StaffSettings,
    social: SocialSettings,
    chat: ChatSettings,
    backup: BackupSettings,
    maintenance: MaintenanceSettings,
    api: APISettings,
    theme: ThemeSettings,
    language: LanguageSettings,
    analytics: AnalyticsSettings,
    advanced: AdvancedSettings,
  };

  const ActiveRenderer = tabComponents[activeTab] || GeneralSettings;

  return (
    <div className="min-h-screen text-white">
      {/* Inject custom styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-modal-in {
          animation: modalIn 0.3s ease-out forwards;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,165,0,0.3);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,165,0,0.5);
        }
      `}</style>

      {/* Inner Settings Navigation (Horizontal Tabs for Outlet) */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-orange-300/70">Manage your application preferences</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
              <span className="absolute right-3 top-2.5 text-white/40">🔍</span>
            </div>
            <Button onClick={handleSave} className="shadow-2xl shadow-orange-500/30 ring-2 ring-white/20">
              {settingsSaving ? "💾 Saving..." : "💾 Save Changes"}
            </Button>
          </div>
        </div>

        {(settingsLoading || settingsError) && (
          <div className="mb-4">
            {settingsLoading && (
              <div className="p-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white/60">
                Loading settings...
              </div>
            )}
            {!settingsLoading && settingsError && (
              <div className="p-3 bg-red-500/15 border border-red-400/20 rounded-xl text-sm text-red-200">
                {settingsError}
              </div>
            )}
          </div>
        )}

        {/* Horizontal Scrollable Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {sidebarGroups.flatMap(g => g.items).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-300 to-green-400 text-gray-900 shadow-lg shadow-orange-500/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
        <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
        <span>/</span>
        <span className="hover:text-white cursor-pointer transition-colors">Settings</span>
        <span>/</span>
        <span className="text-orange-300/80">
          {sidebarGroups.flatMap(g => g.items).find(i => i.id === activeTab)?.label || "General"}
        </span>
      </div>

      {/* Content */}
      {ActiveRenderer()}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalConfig.title}
        onConfirm={modalConfig.onConfirm}
      >
        {modalConfig.content}
      </Modal>
    </div>
  );
}
