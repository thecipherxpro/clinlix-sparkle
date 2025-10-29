import { ReactNode } from 'react';
import { useDirection } from '@/hooks/useDirection';

interface I18nLayoutProps {
  children: ReactNode;
}

export const I18nLayout = ({ children }: I18nLayoutProps) => {
  useDirection();
  
  return <>{children}</>;
};
