import { useTranslation } from 'react-i18next';

export const useFormatNumber = () => {
  const { i18n } = useTranslation();
  
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(i18n.language, options).format(value);
  };
  
  const formatCurrency = (value: number, currency: string = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    }).format(value);
  };
  
  const formatPercent = (value: number, decimals: number = 0) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };
  
  const formatCompact = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };
  
  return {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatCompact,
  };
};
