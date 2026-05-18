import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bn from './locales/bn.json';
import en from './locales/en.json';

const STORAGE_KEY = 'hbc_website_lang';

const savedLang = (() => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en' || v === 'bn') return v;
  } catch {
    /* ignore */
  }
  return 'bn';
})();

i18n.use(initReactI18next).init({
  resources: {
    bn: { translation: bn },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: 'bn',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng.startsWith('en') ? 'en' : 'bn');
  } catch {
    /* ignore */
  }
  document.documentElement.lang = lng.startsWith('en') ? 'en' : 'bn';
});

document.documentElement.lang = savedLang === 'en' ? 'en' : 'bn';

export default i18n;
