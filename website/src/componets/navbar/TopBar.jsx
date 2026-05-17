import { useState } from 'react';

const TopBar = ({ supportPhone = '', storeAddress = '' }) => {
  const [language, setLanguage] = useState('EN');
  const phone = String(supportPhone || '').trim();
  const address = String(storeAddress || '').trim();

  return (
    <div className="bg-emerald-50 text-emerald-800 text-xs hidden md:block border-b border-emerald-100 z-30">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer transition font-medium">
            <span className="text-orange-400">📞</span> {phone || "017XX-XXXXXX"}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-orange-400">🚚</span> Home Delivery Available
          </span>
          <span className="flex items-center gap-1.5 font-medium max-w-90 truncate" title={address || undefined}>
            <span className="text-orange-400">📍</span> {address || "Dhaka, Bangladesh"}
          </span>
        </div>
        <button 
          onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
          className="flex items-center gap-1.5 hover:text-emerald-600 transition font-semibold bg-white px-3 py-1 rounded-full border border-emerald-200"
        >
          <span>{language === 'EN' ? '🇬🇧' : '🇧🇩'}</span>
          {language}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
