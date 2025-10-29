import { useTranslation } from 'react-i18next';
import { format, formatDistanceToNow, type Locale } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { enUS, es, fr, pt, arSA } from 'date-fns/locale';

const localeMap: Record<string, Locale> = {
  en: enUS,
  es: es,
  fr: fr,
  'pt-PT': pt,
  ar: arSA,
};

export const useFormatDate = () => {
  const { i18n } = useTranslation();
  
  const getLocale = () => localeMap[i18n.language] || enUS;
  
  const formatDate = (date: Date | string, formatStr: string = 'PPP') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: getLocale() });
  };
  
  const formatDateTime = (date: Date | string, formatStr: string = 'PPp') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: getLocale() });
  };
  
  const formatTime = (date: Date | string, formatStr: string = 'p') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatStr, { locale: getLocale() });
  };
  
  const formatRelative = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: getLocale() });
  };
  
  const formatWithTimezone = (date: Date | string, timeZone: string, formatStr: string = 'PPp') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const zonedDate = toZonedTime(dateObj, timeZone);
    return format(zonedDate, formatStr, { locale: getLocale() });
  };
  
  return {
    formatDate,
    formatDateTime,
    formatTime,
    formatRelative,
    formatWithTimezone,
  };
};
