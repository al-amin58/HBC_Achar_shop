import { useState, useEffect } from 'react';
import MainNavbar from './MainNavbar.jsx';
import SearchBar from '../SearchBar.jsx';

const StickyNavbar = ({ cartCount, onCartOpen, onMobileMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-lg shadow-emerald-100/50' : ''
      }`}
    >
      <MainNavbar 
        isScrolled={isScrolled}
        cartCount={cartCount}
        onCartOpen={onCartOpen}
        onMobileMenuOpen={onMobileMenuOpen}
        searchComponent={<SearchBar />}
        mobileSearchComponent={(isOpen, onClose) => (
          <SearchBar mobile isOpen={isOpen} onClose={onClose} />
        )}
      />
    </div>
  );
};

export default StickyNavbar;