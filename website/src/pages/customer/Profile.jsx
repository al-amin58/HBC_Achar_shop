import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Badge,
  Drawer,
  Dropdown,
  Skeleton,
} from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  WalletOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  FileImageOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import api from "../../api/axios.js";
import { getAuthToken } from "../../componets/useCart.jsx";

import DashboardTab from "./dashboard/DashboardTab.jsx";
import OrdersTab from "./dashboard/OrdersTab.jsx";
import WalletTab from "./dashboard/WalletTab.jsx";
import WishlistTab from "./dashboard/WishlistTab.jsx";
import AddressTab from "./dashboard/AddressTab.jsx";
import LandingTab from "./dashboard/LandingTab.jsx";
import NotificationsTab from "./dashboard/NotificationsTab.jsx";
import SupportTab from "./dashboard/SupportTab.jsx";
import SettingsTab from "./dashboard/SettingsTab.jsx";
import { mapOrderForUI } from "./dashboard/constants.js";

const { Sider, Header, Content } = Layout;

/* ─── Breakpoints ────────────────────────────────────────────── */
// mobile  : < 768
// tablet  : 768 – 1023
// desktop : ≥ 1024

const MENU_ITEMS = [
  { key: "dashboard", label: "ড্যাশবোর্ড", icon: <DashboardOutlined /> },
  { key: "orders", label: "আমার অর্ডার", icon: <ShoppingOutlined /> },
  { key: "wallet", label: "ওয়ালেট", icon: <WalletOutlined /> },
  { key: "wishlist", label: "উইশলিস্ট", icon: <HeartOutlined /> },
  { key: "addresses", label: "ঠিকানা", icon: <EnvironmentOutlined /> },
  { key: "landing", label: "ল্যান্ডিং পেজ", icon: <FileImageOutlined /> },
  { key: "notifications", label: "নোটিফিকেশন", icon: <BellOutlined /> },
  {
    key: "support",
    label: "সাপোর্ট সেন্টার",
    icon: <CustomerServiceOutlined />,
  },
  { key: "settings", label: "সেটিংস", icon: <SettingOutlined /> },
];

const BOTTOM_NAV = MENU_ITEMS.slice(0, 5);

/* ─── Ant Design theme ───────────────────────────────────────── */
const antTheme = {
  token: {
    colorPrimary: "#f97316",
    colorLink: "#f97316",
    colorLinkHover: "#ea580c",
    borderRadius: 12,
    fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },
  components: {
    Menu: {
      itemSelectedBg: "#fff3e8",
      itemSelectedColor: "#f97316",
      itemHoverBg: "#fff7ed",
      itemHoverColor: "#ea580c",
    },
    Layout: { siderBg: "#ffffff", headerBg: "rgba(255,255,255,0.95)" },
    Table: { headerBg: "#f9fafb" },
  },
};

/* ─── Sidebar content (shared) ───────────────────────────────── */
function SidebarContent({
  user,
  collapsed,
  activeKey,
  unreadCount,
  onSelect,
  onLogout,
}) {
  return (
    <>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 border-b border-gray-100 flex-shrink-0"
        style={{ height: 64, minHeight: 64 }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
        >
          <span className="text-white font-black text-xs">HBC</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-black text-gray-900 text-sm leading-tight truncate">
              HBC Achar
            </p>
            <p className="text-[10px] text-gray-400">Customer Panel</p>
          </div>
        )}
      </div>

      {/* User card */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Avatar
              size={34}
              style={{
                background: "linear-gradient(135deg,#f97316,#ef4444)",
                fontWeight: 700,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {(user?.name || "C").charAt(0).toUpperCase()}
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {user?.name || "Customer"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.phonenumber || ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1">
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          inlineCollapsed={collapsed}
          onClick={({ key }) => {
            if (key === "logout") {
              onLogout();
              return;
            }
            onSelect(key);
          }}
          style={{ border: "none", padding: "0 8px" }}
          items={[
            ...MENU_ITEMS.map((m) => ({
              ...m,
              label:
                m.key === "notifications" ? (
                  <Badge count={unreadCount} size="small" offset={[6, -2]}>
                    <span>{m.label}</span>
                  </Badge>
                ) : (
                  m.label
                ),
            })),
            { type: "divider" },
            {
              key: "logout",
              label: "লগআউট",
              icon: <LogoutOutlined />,
              danger: true,
            },
          ]}
          className="font-medium text-sm"
        />
      </div>
    </>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [landingRequests, setLandingRequests] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState("dashboard");

  /* Responsive state */
  const [screenW, setScreenW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );
  const isMobile = screenW < 768;
  const isTablet = screenW >= 768 && screenW < 1024;
  const isDesktop = screenW >= 1024;

  /* Sidebar state */
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // mobile/tablet drawer

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenW(w);
      // Auto-collapse on tablet, expand on desktop
      if (w >= 768 && w < 1024) setCollapsed(true);
      if (w >= 1024) setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const reloadAddresses = useCallback(async () => {
    const res = await api.get("/profile/addresses");
    setAddresses(Array.isArray(res.data) ? res.data : []);
  }, []);

  const reloadWishlist = useCallback(async () => {
    const res = await api.get("/profile/wishlist");
    setWishlist(Array.isArray(res.data) ? res.data : []);
  }, []);

  const reloadNotifications = useCallback(async () => {
    const res = await api.get("/profile/notifications");
    setNotifications(Array.isArray(res.data) ? res.data : []);
  }, []);

  const reloadLanding = useCallback(async () => {
    const res = await api.get("/profile/landing-requests");
    setLandingRequests(Array.isArray(res.data) ? res.data : []);
  }, []);

  const reloadTickets = useCallback(async () => {
    const res = await api.get("/profile/support-tickets");
    setSupportTickets(Array.isArray(res.data) ? res.data : []);
  }, []);

  const reloadWallet = useCallback(async () => {
    const res = await api.get("/profile/wallet");
    setWallet(res.data);
  }, []);

  const reloadOrders = useCallback(async () => {
    const res = await api.get("/orders/my");
    const raw = Array.isArray(res.data) ? res.data : [];
    setOrders(raw.map(mapOrderForUI));
  }, []);

  const reloadDevices = useCallback(async () => {
    const res = await api.get("/profile/devices");
    setDevices(Array.isArray(res.data) ? res.data : []);
  }, []);

  /* Auth + load */
  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login", { state: { from: "/customer" } });
      return;
    }
    (async () => {
      try {
        const [
          meRes,
          ordersRes,
          addrRes,
          walletRes,
          wishRes,
          notifRes,
          landingRes,
          ticketRes,
          devicesRes,
        ] = await Promise.all([
          api.get("/auth/me"),
          api.get("/orders/my"),
          api.get("/profile/addresses"),
          api.get("/profile/wallet"),
          api.get("/profile/wishlist"),
          api.get("/profile/notifications"),
          api.get("/profile/landing-requests"),
          api.get("/profile/support-tickets"),
          api.get("/profile/devices"),
        ]);
        setProfile(meRes.data);
        const rawOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        setOrders(rawOrders.map(mapOrderForUI));
        setAddresses(Array.isArray(addrRes.data) ? addrRes.data : []);
        setWallet(walletRes.data);
        setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);
        setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
        setLandingRequests(
          Array.isArray(landingRes.data) ? landingRes.data : [],
        );
        setSupportTickets(Array.isArray(ticketRes.data) ? ticketRes.data : []);
        setDevices(Array.isArray(devicesRes.data) ? devicesRes.data : []);
      } catch (err) {
        toast.error(err.response?.data?.message || "ডেটা লোড ব্যর্থ");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /**/
    }
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("hbc-auth-logout"));
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const user = profile?.user;

  const handleMenuSelect = useCallback((key) => {
    setActiveKey(key);
    setMobileDrawerOpen(false);
  }, []);

  const renderTab = () => {
    if (loading)
      return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} active paragraph={{ rows: 3 }} />
          ))}
        </div>
      );
    switch (activeKey) {
      case "dashboard":
        return (
          <DashboardTab
            profile={profile}
            orders={orders}
            wallet={wallet}
            onGoToOrders={() => handleMenuSelect("orders")}
          />
        );
      case "orders":
        return <OrdersTab orders={orders} onRefresh={reloadOrders} />;
      case "wallet":
        return <WalletTab wallet={wallet} onRefresh={reloadWallet} />;
      case "wishlist":
        return <WishlistTab items={wishlist} onRefresh={reloadWishlist} />;
      case "addresses":
        return <AddressTab addresses={addresses} onRefresh={reloadAddresses} />;
      case "landing":
        return (
          <LandingTab requests={landingRequests} onRefresh={reloadLanding} />
        );
      case "notifications":
        return (
          <NotificationsTab
            items={notifications}
            onRefresh={reloadNotifications}
            onMarkRead={async (id) => {
              await api.patch(`/profile/notifications/${id}/read`);
              await reloadNotifications();
            }}
            onMarkAll={async () => {
              await api.patch("/profile/notifications/read-all");
              await reloadNotifications();
            }}
          />
        );
      case "support":
        return (
          <SupportTab tickets={supportTickets} onRefresh={reloadTickets} />
        );
      case "settings":
        return (
          <SettingsTab
            profile={profile}
            devices={devices}
            onProfileUpdate={setProfile}
            onDevicesRefresh={reloadDevices}
            onNotificationSettingsChange={async (settings) => {
              await api.put("/profile/notification-settings", settings);
              setProfile((p) => ({ ...p, notificationSettings: settings }));
            }}
          />
        );
      default:
        return null;
    }
  };

  const profileMenu = {
    items: [
      {
        key: "settings",
        label: "সেটিংস",
        icon: <SettingOutlined />,
        onClick: () => handleMenuSelect("settings"),
      },
      {
        key: "support",
        label: "সাপোর্ট",
        icon: <CustomerServiceOutlined />,
        onClick: () => handleMenuSelect("support"),
      },
      { type: "divider" },
      {
        key: "logout",
        label: "লগআউট",
        icon: <LogoutOutlined />,
        danger: true,
        onClick: handleLogout,
      },
    ],
  };

  const currentLabel =
    MENU_ITEMS.find((m) => m.key === activeKey)?.label || "ড্যাশবোর্ড";

  /* ── Shared top-bar ── */
  const TopBar = ({ padX = "px-4 sm:px-6" }) => (
    <Header
      className={`flex items-center justify-between ${padX} shadow-sm border-b border-gray-100 flex-shrink-0`}
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        height: 60,
        lineHeight: "60px",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile + tablet) */}
        {!isDesktop && (
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors text-gray-600 hover:text-orange-600"
          >
            <MenuUnfoldOutlined />
          </button>
        )}
        {/* Collapse toggle (desktop only) */}
        {isDesktop && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors text-gray-600 hover:text-orange-600"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        )}
        {/* Logo on mobile */}
        {isMobile && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f97316,#ef4444)" }}
          >
            <span className="text-white font-black text-[10px]">HBC</span>
          </div>
        )}
        <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-[140px] sm:max-w-xs">
          {currentLabel}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge count={unreadCount} color="orange">
          <button
            onClick={() => handleMenuSelect("notifications")}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-orange-100 flex items-center justify-center transition-colors text-gray-600 hover:text-orange-600"
          >
            <BellOutlined />
          </button>
        </Badge>
        <Dropdown
          menu={profileMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="flex items-center gap-2 pl-1 sm:pl-2 pr-2 sm:pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors">
            <Avatar
              size={32}
              style={{
                background: "linear-gradient(135deg,#f97316,#ef4444)",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {(user?.name || "C").charAt(0).toUpperCase()}
            </Avatar>
            <span className="text-sm font-semibold text-gray-800 hidden lg:block max-w-[120px] truncate">
              {user?.name || "Customer"}
            </span>
          </button>
        </Dropdown>
      </div>
    </Header>
  );

  return (
    <ConfigProvider theme={antTheme}>
      {/* ═══════════════════════════════════════════════════════
          DESKTOP (≥ 1024px) — sticky sidebar + main layout
      ════════════════════════════════════════════════════════ */}
      {isDesktop && (
        <Layout
          style={{ height: "100vh", overflow: "hidden", background: "#f8f9fa" }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            trigger={null}
            width={240}
            collapsedWidth={80}
            style={{
              background: "#ffffff",
              borderRight: "1px solid #f3f4f6",
              boxShadow: "2px 0 12px rgba(0,0,0,0.05)",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SidebarContent
              user={user}
              collapsed={collapsed}
              activeKey={activeKey}
              unreadCount={unreadCount}
              onSelect={handleMenuSelect}
              onLogout={handleLogout}
            />
          </Sider>

          <Layout
            style={{
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TopBar padX="px-6" />
            <Content style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {renderTab()}
              </div>
            </Content>
          </Layout>
        </Layout>
      )}

      {/* ═══════════════════════════════════════════════════════
          TABLET (768–1023px) — top bar + drawer sidebar + bottom nav
      ════════════════════════════════════════════════════════ */}
      {isTablet && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            background: "#f8f9fa",
          }}
        >
          <ConfigProvider theme={antTheme}>
            <TopBar padX="px-4" />
          </ConfigProvider>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>{renderTab()}</div>
          </div>
          {/* Drawer sidebar */}
          <Drawer
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            placement="left"
            width={260}
            closable={false}
            bodyStyle={{
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            headerStyle={{ display: "none" }}
          >
            <div className="flex flex-col h-full">
              <SidebarContent
                user={user}
                collapsed={false}
                activeKey={activeKey}
                unreadCount={unreadCount}
                onSelect={handleMenuSelect}
                onLogout={handleLogout}
              />
            </div>
          </Drawer>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MOBILE (< 768px) — top bar + drawer + bottom nav
      ════════════════════════════════════════════════════════ */}
      {isMobile && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            background: "#f8f9fa",
          }}
        >
          <ConfigProvider theme={antTheme}>
            <TopBar padX="px-3" />
          </ConfigProvider>

          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: "12px 12px 90px 12px",
              overflowY: "auto",
            }}
          >
            {renderTab()}
          </div>

          {/* Bottom navigation */}
          <div
            className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid grid-cols-5">
              {BOTTOM_NAV.map((m) => {
                const active = activeKey === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => handleMenuSelect(m.key)}
                    className="flex flex-col items-center justify-center gap-0.5 py-2 transition-colors relative"
                    style={{ color: active ? "#f97316" : "#9ca3af" }}
                  >
                    {active && (
                      <span
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                        style={{ background: "#f97316" }}
                      />
                    )}
                    <span style={{ fontSize: 20 }}>
                      {m.key === "notifications" ? (
                        <Badge count={unreadCount} size="small">
                          {m.icon}
                        </Badge>
                      ) : (
                        m.icon
                      )}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600 }}>
                      {m.label.slice(0, 4)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer sidebar (mobile) */}
          <Drawer
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            placement="left"
            width={240}
            closable={false}
            bodyStyle={{
              padding: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
            headerStyle={{ display: "none" }}
          >
            <div className="flex flex-col h-full">
              <SidebarContent
                user={user}
                collapsed={false}
                activeKey={activeKey}
                unreadCount={unreadCount}
                onSelect={handleMenuSelect}
                onLogout={handleLogout}
              />
            </div>
          </Drawer>
        </div>
      )}
    </ConfigProvider>
  );
}
