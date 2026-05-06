import { useState } from 'react';
import { categories, pages } from '../../data/navbarData.js';

const MobileMenu = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("categories");

  if (!isOpen) return null;

  const TabButton = ({ label, tabKey }) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-200 ${
        activeTab === tabKey
          ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-105"
          : "bg-white text-emerald-700 hover:bg-orange-50 border border-emerald-200"
      }`}
    >
      {label}
    </button>
  );

  const GridItem = ({ item }) => (
    <a
      href={item.href}
      className="flex items-center gap-2 py-2 px-3 text-sm text-emerald-800 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition font-medium border border-emerald-100 hover:border-orange-200"
    >
      <span>{item.icon}</span>
      <span>{item.name}</span>
    </a>
  );

  return (
    <>
      <div 
        className="fixed inset-0 bg-emerald-900/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="p-5 text-black flex justify-between items-center border-b border-emerald-100">
          <div className="w-30 h-11   flex items-center justify-center ">
            <img src="./logo.svg" alt="" srcset="" />
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-emerald-50 rounded-full transition text-emerald-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex p-2 gap-2 bg-emerald-50 border-b border-emerald-100">
          <TabButton label="Categories" tabKey="categories" />
          <TabButton label="Pages" tabKey="pages" />
        </div>

        {/* Content */}
        <div className="p-5 animate-fadeIn">
          <h3 className="font-bold text-orange-400 text-xs uppercase tracking-wider mb-3">
            {activeTab === "categories" ? "Categories" : "Pages"}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(activeTab === "categories" ? categories : pages).map((item, idx) => (
              <GridItem key={idx} item={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;