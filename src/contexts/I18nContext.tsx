import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { translations, Language, TranslationKeys } from '@/i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: TranslationKeys;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  // Load user's language preference from profile
  useEffect(() => {
    loadUserLanguage();
  }, []);

  const loadUserLanguage = async () => {
    try {
      // First, try to load from localStorage for instant UI
      const cachedLang = localStorage.getItem('app-language');
      if (cachedLang === 'en' || cachedLang === 'pt') {
        setLanguageState(cachedLang);
      }

      // Then fetch from database to sync
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (profile?.language && (profile.language === 'en' || profile.language === 'pt')) {
          setLanguageState(profile.language);
          localStorage.setItem('app-language', profile.language);
        }
      }
    } catch (error) {
      console.error('Error loading user language:', error);
      // Fallback to English on error
      setLanguageState('en');
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update in database
        const { error } = await supabase
          .from('profiles')
          .update({ language: lang })
          .eq('id', user.id);

        if (error) throw error;
      }
      
      // Update local state
      setLanguageState(lang);
      
      // Store in localStorage as backup
      localStorage.setItem('app-language', lang);
    } catch (error) {
      console.error('Error setting language:', error);
      // Still update local state even if DB update fails
      setLanguageState(lang);
      localStorage.setItem('app-language', lang);
    }
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    isLoading,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
