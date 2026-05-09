
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router";

// font-sans
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen my-heading"
    style={{
                background: 'linear-gradient(90deg, #fdba74, #fde68a, #86efac, #fcd34d, #fdba74)',
                                                
              }}
    >
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;