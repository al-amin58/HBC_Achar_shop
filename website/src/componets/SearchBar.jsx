import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { searchData } from "../pages/website/data/navbarData.js";

const SearchBar = ({ mobile = false }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const filtered = searchData.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setQuery(item);
    setShowSuggestions(false);
  };

  const inputClasses = mobile
    ? "w-full pl-4 pr-10 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 text-emerald-800 placeholder:text-emerald-300"
    : "w-full pl-5 pr-12 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-full focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all placeholder:text-emerald-300/70 text-emerald-800";

  return (
    <div className={mobile ? "" : "relative flex-1"} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={t('nav.searchPlaceholder')}
          className={inputClasses}
        />
        <button
          className={`absolute ${mobile ? "right-3 top-1/2 -translate-y-1/2 text-orange-400" : "right-1.5 top-1/2 -translate-y-1/2 bg-linear-to-r from-orange-300 to-orange-400 text-white p-2 rounded-full hover:from-orange-400 hover:to-orange-500 transition shadow-md shadow-orange-200"}`}
        >
          <svg
            className={mobile ? "w-5 h-5" : "w-4 h-4"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>

      {showSuggestions && (
        <div
          className={`bg-white  border border-emerald-100 py-2 z-50 overflow-hidden ${mobile ? "mt-2 rounded-xl absolute left-2 right-2" : "  absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl shadow-emerald-100 "}`}
        >
          <div className="px-4 py-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            {t('nav.suggestions')}
          </div>
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 transition group"
                onClick={() => handleSelect(item)}
              >
                <svg
                  className="w-4 h-4 text-orange-300 group-hover:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-emerald-800 text-sm font-medium">
                  {item}
                </span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-emerald-300 text-sm">
              {t('nav.noProductsFound')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
