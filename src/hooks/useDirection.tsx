import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const useDirection = () => {
  const { i18n } = useTranslation();
  
  const direction = RTL_LANGUAGES.includes(i18n.language) ? 'rtl' : 'ltr';
  const isRTL = direction === 'rtl';
  
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = i18n.language;
  }, [direction, i18n.language]);
  
  return { direction, isRTL };
};
