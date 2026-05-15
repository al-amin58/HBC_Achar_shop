import { useState, useEffect } from 'react';

// ==========================================
// HBC ACHAR - ADMIN SETTINGS PAGE ONLY
// For: <Outlet /> inside AdminLayout
// Theme: Jam BG + Light Green/Orange Buttons
// ==========================================

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
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-[#3d0c3d] text-white">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const Card = ({ children, title, icon, className = "" }) => (
  <div className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden ${className}`}>
    {(title || icon) && (
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-white/10 to-transparent">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          {icon && <span className="text-orange-300">{icon}</span>}
          {title}
        </h3>
      </div>
    )}
    <div className="p-6 space-y-4">
      {children}
    </div>
  </div>
);

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
  const [saveSticky, setSaveSticky] = useState(false);

  // Scroll listener for sticky save button
  useEffect(() => {
    const handleScroll = () => setSaveSticky(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- State for all settings ---
  const [settings, setSettings] = useState({
    // General
    siteName: "HBC Achar",
    siteTitle: "Premium Bengali Pickles - HBC Achar",
    adminEmail: "admin@hbcachar.com",
    supportPhone: "+880 1XXX-XXXXXX",
    timezone: "Asia/Dhaka",
    dateFormat: "DD/MM/YYYY",
    maintenanceMode: false,

    // Store
    storeAddress: "123 Pickle Lane, Dhaka, Bangladesh",
    storeMap: "",
    defaultCurrency: "BDT",
    currencySymbol: "৳",
    minOrderAmount: "500",
    codEnabled: true,
    guestCheckout: true,

    // Logo
    logoPreview: "",
    faviconPreview: "",
    adminLogoPreview: "",
    loaderPreview: "",
    primaryColor: "#FF6B35",
    secondaryColor: "#4ECDC4",

    // SEO
    metaTitle: "HBC Achar - Premium Bengali Pickles",
    metaDescription: "Authentic homemade Bengali pickles delivered to your doorstep. Mango, olive, chili and more traditional flavors.",
    metaKeywords: "achar, pickle, bengali, mango, olive, homemade, traditional",
    ogImagePreview: "",
    googleVerify: "",
    robotsTxt: "User-agent: *\nDisallow: /admin/\nDisallow: /cart/\nAllow: /",
    sitemapEnabled: true,

    // Payment
    sslcommerzEnabled: true,
    sslcommerzKey: "",
    sslcommerzSecret: "",
    sslcommerzSandbox: true,
    stripeEnabled: false,
    stripeKey: "",
    stripeSecret: "",
    stripeSandbox: true,
    paypalEnabled: false,
    bkashEnabled: true,
    bkashKey: "",
    bkashSecret: "",
    bkashSandbox: true,
    nagadEnabled: true,
    rocketEnabled: false,
    codEnabledPayment: true,

    // Wallet
    walletEnabled: true,
    minRecharge: "100",
    cashbackPercent: "5",
    referralBonus: "50",
    walletExpireDays: "365",
    autoRefund: true,

    // Flash Sale
    flashSaleEnabled: true,
    flashTimer: "24",
    productLimit: "10",
    autoExpire: true,
    homepageFlash: true,

    // Shipping
    deliveryZones: "Dhaka City, Outside Dhaka",
    shippingCharge: "60",
    freeShippingLimit: "1000",
    estDeliveryTime: "2-3 Business Days",
    deliveryPartner: "Pathao",

    // Tax
    vatPercent: "5",
    taxEnabled: true,
    invoicePrefix: "HBC-INV",
    invoiceFooter: "Thank you for choosing HBC Achar!",
    autoInvoice: true,

    // Order
    autoConfirm: false,
    autoCancelHours: "48",
    returnDays: "7",
    autoSendInvoice: true,

    // Product
    productApproval: false,
    stockWarning: "10",
    skuAuto: true,
    productReview: true,
    relatedProduct: true,

    // Variation
    colorEnabled: true,
    sizeEnabled: true,
    unitEnabled: true,
    dynamicVariation: true,

    // Customer
    registrationEnabled: true,
    otpVerify: true,
    customerWallet: true,
    rewardPoints: true,
    guestControl: true,

    // Notification
    pushEnabled: true,
    orderNotify: true,
    deliveryNotify: true,
    promoNotify: false,

    // Email
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "",
    smtpPass: "",
    mailEncrypt: "TLS",

    // SMS
    smsProvider: "Twilio",
    smsApiKey: "",
    senderId: "HBCACHAR",
    otpSms: true,

    // Landing
    heroSlider: true,
    featuredProduct: true,
    dynamicSort: true,

    // Banner
    homeBannerPreview: "",
    offerBannerPreview: "",
    popupBannerPreview: "",
    bannerActive: true,
    bannerSchedule: "",

    // Coupon
    couponAutoApply: false,
    couponLimit: "1",
    firstOrderCoupon: true,
    referralCoupon: true,
    flashCoupon: true,

    // Auth
    googleLogin: true,
    facebookLogin: false,
    jwtExpire: "24",
    loginAttempts: "5",
    twoFactor: false,

    // Staff
    adminRole: "Super Admin",
    staffRole: "Manager",

    // Social
    facebook: "https://facebook.com/hbcachar",
    instagram: "https://instagram.com/hbcachar",
    youtube: "",
    tiktok: "",
    whatsapp: "+8801XXXXXXXXX",

    // Chat
    liveChat: true,
    messenger: false,
    whatsappChat: true,
    ticketSystem: true,

    // Backup
    autoBackup: "daily",

    // Maintenance
    cacheClear: false,
    debugMode: false,

    // API
    googleAnalytics: "",
    fbPixel: "",
    firebaseConfig: "",

    // Theme
    darkMode: false,
    sidebarStyle: "default",
    themeColor: "orange",
    fontFamily: "Inter",

    // Language
    multiLang: true,
    currencyRate: "1",
    rtlSupport: false,

    // Analytics
    visitorTrack: true,
    salesTrack: true,
    conversionTrack: false,
    heatmap: false,

    // Advanced
    cronJob: "*/5 * * * *",
    queueSystem: true,
    redisCache: false,
    devMode: false,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const showModal = (title, content, onConfirm) => {
    setModalConfig({ title, content, onConfirm });
    setModalOpen(true);
  };

  const handleSave = () => {
    alert("Settings saved successfully! ✅");
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
          <FileUpload label="Store Location Map" preview={settings.storeMap} onChange={(e) => updateSetting("storeMap", URL.createObjectURL(e.target.files[0]))} />
        </Card>
        <Card title="Currency & Checkout" icon="💰">
          <SelectField label="Default Currency" value={settings.defaultCurrency} onChange={(v) => updateSetting("defaultCurrency", v)} 
            options={[{value:"BDT", label:"Bangladeshi Taka (BDT)"}, {value:"USD", label:"US Dollar (USD)"}, {value:"INR", label:"Indian Rupee (INR)"}]} />
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
            <FileUpload label="Site Logo" preview={settings.logoPreview} onChange={(e) => updateSetting("logoPreview", URL.createObjectURL(e.target.files[0]))} />
            <FileUpload label="Favicon" preview={settings.faviconPreview} onChange={(e) => updateSetting("faviconPreview", URL.createObjectURL(e.target.files[0]))} />
            <FileUpload label="Admin Logo" preview={settings.adminLogoPreview} onChange={(e) => updateSetting("adminLogoPreview", URL.createObjectURL(e.target.files[0]))} />
            <FileUpload label="Loader Icon" preview={settings.loaderPreview} onChange={(e) => updateSetting("loaderPreview", URL.createObjectURL(e.target.files[0]))} />
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
          <FileUpload label="OG Image" preview={settings.ogImagePreview} onChange={(e) => updateSetting("ogImagePreview", URL.createObjectURL(e.target.files[0]))} />
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
      <SectionHeader title="Flash Sale Settings" subtitle="Configure flash sale timers and limits" />
      <Card title="Flash Sale Configuration" icon="⚡">
        <Toggle label="Enable Flash Sale" checked={settings.flashSaleEnabled} onChange={(v) => updateSetting("flashSaleEnabled", v)} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField label="Timer Duration (Hours)" type="number" value={settings.flashTimer} onChange={(v) => updateSetting("flashTimer", v)} />
          <InputField label="Product Limit" type="number" value={settings.productLimit} onChange={(v) => updateSetting("productLimit", v)} />
          <InputField label="Auto Expire" type="text" value={settings.autoExpire ? "Enabled" : "Disabled"} onChange={() => {}} disabled />
        </div>
        <div className="mt-4 space-y-3">
          <Toggle label="Auto Expire Flash Sales" checked={settings.autoExpire} onChange={(v) => updateSetting("autoExpire", v)} />
          <Toggle label="Show on Homepage" checked={settings.homepageFlash} onChange={(v) => updateSetting("homepageFlash", v)} />
        </div>
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
          <FileUpload label="Homepage Banner" preview={settings.homeBannerPreview} onChange={(e) => updateSetting("homeBannerPreview", URL.createObjectURL(e.target.files[0]))} />
          <FileUpload label="Offer Banner" preview={settings.offerBannerPreview} onChange={(e) => updateSetting("offerBannerPreview", URL.createObjectURL(e.target.files[0]))} />
          <FileUpload label="Popup Banner" preview={settings.popupBannerPreview} onChange={(e) => updateSetting("popupBannerPreview", URL.createObjectURL(e.target.files[0]))} />
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
          <Button onClick={() => showModal("Manual Backup", "Create a full database backup now?", () => alert("Backup started!"))}>Create Manual Backup</Button>
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
          <Button variant="danger" onClick={() => showModal("Clear Cache", "This will clear all application cache. Continue?", () => alert("Cache cleared!"))}>Clear Cache</Button>
          <Button onClick={() => alert("System logs downloaded!")}>Download System Logs</Button>
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

  // --- Tab Mapping ---
  const tabComponents = {
    general: GeneralSettings,
    store: StoreSettings,
    logo: LogoBranding,
    seo: SEOSettings,
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

  const ActiveComponent = tabComponents[activeTab] || GeneralSettings;

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
          <div className="relative">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            />
            <span className="absolute right-3 top-2.5 text-white/40">🔍</span>
          </div>
        </div>

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
      <ActiveComponent />

      {/* Bottom Spacer for sticky button */}
      <div className="h-24" />

      {/* Sticky Save Button */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${saveSticky ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <Button onClick={handleSave} className="shadow-2xl shadow-orange-500/30 ring-2 ring-white/20">
          💾 Save Changes
        </Button>
      </div>

      {/* Mobile Save Button (always visible on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#3d0c3d] to-transparent z-40">
        <Button onClick={handleSave} className="w-full shadow-xl">
          💾 Save All Changes
        </Button>
      </div>

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