
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router";
import { CartProvider } from "../../../componets/useCart.jsx";

const MainLayout = () => {
  return (
    <CartProvider>
      <div
        className="flex flex-col min-h-screen website-pages"
        style={{
          background:
            "linear-gradient(90deg, #fdba74, #fde68a, #86efac, #fcd34d, #fdba74)",
        }}
      >
        <Navbar />
        <main className="grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default MainLayout;
