import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBar from '../SearchBar.jsx';

const MainNavbar = ({ 
  isScrolled, 
  cartCount, 
  onCartOpen, 
  onMobileMenuOpen,
  logoUrl
}) => {
  const { t } = useTranslation();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <nav className={`bg-white  transition-all duration-300 border-b border-emerald-100 ${isScrolled ? 'shadow-lg shadow-emerald-100/50' : ''}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 hover:bg-emerald-50 rounded-xl transition text-emerald-700"
            onClick={onMobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-30 h-11  flex items-center justify-center">
              <img src={logoUrl || "./logo.svg"} alt="HBC Achar Logo" srcSet="" />
            </div>
           
          </a>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-3xl gap-6 mx-4">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Flash Sale */}
            <a 
              href="/flash-sale" 
              className="hidden lg:flex items-center gap-1.5 bg-linear-to-r from-orange-200 to-orange-100 text-orange-700 px-4 py-2 rounded-full font-bold text-sm hover:from-orange-300 hover:to-orange-200 transition border border-orange-200 shadow-sm"
            >
              <span className="animate-bounce">🔥</span>
              {t('nav.flashSale')}
            </a>

            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden p-2.5 hover:bg-emerald-50 rounded-full transition text-emerald-700"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            >
              {isMobileSearchOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            {/* Cart */}
            <button 
              className="relative p-2.5 hover:bg-emerald-50 rounded-full transition text-emerald-700 cursor-pointer"
              onClick={onCartOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-linear-to-r from-orange-400 to-orange-300 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account */}
            <a 
              href="/customer"
              className="flex items-center gap-2 hover:bg-emerald-50 rounded-full p-1 transition border border-transparent hover:border-emerald-100"
            >
              <div className="w-9 h-9 bg-linear-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </a>
          </div>
        </div>

        {/* Mobile Search - Directly rendered here */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileSearchOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
          <SearchBar mobile />
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
