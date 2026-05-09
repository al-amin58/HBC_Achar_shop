import { useState, useEffect } from "react";
import TopBar from "../../../componets/navbar/TopBar.jsx";
import CampaignBanner from "../../../componets/navbar/CampaignBanner.jsx";
import StickyNavbar from "../../../componets/navbar/MainNavbar.jsx";
import CategoryBar from "../../../componets/navbar/CategoriesBar.jsx";
import CartDrawer from "../../../componets/navbar/CartDrawer.jsx";
import MobileMenu from "../../../componets/navbar/MobileMenu.jsx";
import { initialCartItems } from "../data/navbarData.js";
import "../styles/navbarAnimations.css";

const Navbar = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);

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

  // Cart handlers
  const updateQty = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + change) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  return (
    <div>
      {/* TopBar - NOT sticky, scrolls away */}
      <TopBar />

      {/* CampaignBanner - NOT sticky, scrolls away */}
      <CampaignBanner
        isVisible={isBannerVisible}
        onClose={() => setIsBannerVisible(false)}
      />

      {/* MainNavbar - STICKY only this */}
      <StickyNavbar
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      {/* CategoryBar - NOT sticky, scrolls away */}
      <CategoryBar />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
        cartCount={cartCount}
        cartTotal={cartTotal}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
