import { useTranslation } from 'react-i18next';

const TopBar = ({ supportPhone = '', storeAddress = '' }) => {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const language = isEnglish ? 'EN' : 'BN';
  const phone = String(supportPhone || '').trim();
  const address = String(storeAddress || '').trim();

  const toggleLanguage = () => {
    i18n.changeLanguage(isEnglish ? 'bn' : 'en');
  };

  return (
    <div className="bg-emerald-50 text-emerald-800 text-xs hidden md:block border-b border-emerald-100 z-30">
      <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer transition font-medium">
            <span className="text-orange-400">📞</span> {phone || '017XX-XXXXXX'}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="text-orange-400">🚚</span> {t('topBar.homeDelivery')}
          </span>
          <span className="flex items-center gap-1.5 font-medium max-w-90 truncate" title={address || undefined}>
            <span className="text-orange-400">📍</span> {address || t('topBar.defaultAddress')}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 hover:text-emerald-600 transition font-semibold bg-white px-3 py-1 rounded-full border border-emerald-200"
          aria-label={isEnglish ? 'Switch to Bangla' : 'Switch to English'}
        >
          <span>{language === 'EN' ? '🇬🇧' : '🇧🇩'}</span>
          {language}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
