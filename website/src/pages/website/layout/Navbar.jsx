import { useState, useEffect } from "react";
import TopBar from "../../../componets/navbar/TopBar.jsx";
import CampaignBanner from "../../../componets/navbar/CampaignBanner.jsx";
import StickyNavbar from "../../../componets/navbar/MainNavbar.jsx";
import CategoryBar from "../../../componets/navbar/CategoriesBar.jsx";
import CartDrawer from "../../../componets/navbar/CartDrawer.jsx";
import MobileMenu from "../../../componets/navbar/MobileMenu.jsx";
import api from "../../../api/axios";
import { categories as fallbackCategories } from "../data/navbarData.js";
import { useCart } from "../../../componets/useCart.jsx";
import "../styles/navbarAnimations.css";

const Navbar = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, changeQty, removeFromCart, itemCount, subtotal, cartOpenSignal, openCart } = useCart();
  const [navCategories, setNavCategories] = useState(fallbackCategories);
  const [publicSettings, setPublicSettings] = useState({
    supportPhone: "",
    storeAddress: "",
    logoPreview: "",
    campaignBanner: null,
  });

  // Escape key - global
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    let alive = true;

    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        const rows = Array.isArray(res?.data) ? res.data : [];
        const mapped = rows
          .filter((c) => String(c?.status || "").toLowerCase() !== "inactive")
          .map((c) => {
            const slug = c?.slug ? String(c.slug) : "";
            const href = slug ? `/category-products?category=${encodeURIComponent(slug)}` : "/category-products";
            return {
              name: c?.name ? String(c.name) : "Category",
              href,
            };
          });
        if (!alive) return;
        if (mapped.length > 0) setNavCategories(mapped);
      } catch {
        if (!alive) return;
      }
    };

    void loadCategories();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    const loadPublicSettings = async () => {
      try {
        const res = await api.get("/settings/public");
        const data = res?.data && typeof res.data === "object" ? res.data : {};
        if (!alive) return;
        setPublicSettings({
          supportPhone: String(data.supportPhone || ""),
          storeAddress: String(data.storeAddress || ""),
          logoPreview: String(data.logoPreview || ""),
          campaignBanner:
            data.campaignBanner && typeof data.campaignBanner === "object"
              ? data.campaignBanner
              : null,
        });
      } catch {
        if (!alive) return;
      }
    };
    void loadPublicSettings();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (cartOpenSignal > 0) setIsCartOpen(true);
  }, [cartOpenSignal]);

  return (
    <div>
      {/* TopBar - NOT sticky, scrolls away */}
      <TopBar supportPhone={publicSettings.supportPhone} storeAddress={publicSettings.storeAddress} />

      {/* CampaignBanner - NOT sticky, scrolls away */}
      <CampaignBanner
        data={publicSettings.campaignBanner}
        isVisible={isBannerVisible}
        onClose={() => setIsBannerVisible(false)}
      />

      {/* MainNavbar - STICKY only this */}
      <StickyNavbar
        cartCount={itemCount}
        onCartOpen={openCart}
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
        logoUrl={publicSettings.logoPreview}
      />

      {/* CategoryBar - NOT sticky, scrolls away */}
      <CategoryBar categories={navCategories} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={changeQty}
        onRemoveItem={removeFromCart}
        cartCount={itemCount}
        cartTotal={subtotal}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={navCategories}
      />
    </div>
  );
};

export default Navbar;
