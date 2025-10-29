import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: import.meta.env.DEV,
    
    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'pt-PT', 'ar'],
    
    // Ensure Portuguese uses European variant
    load: 'currentOnly',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Namespace configuration
    ns: ['common', 'auth', 'booking', 'provider', 'customer', 'errors'],
    defaultNS: 'common',
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;
