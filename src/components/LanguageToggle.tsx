import { useI18n } from '@/contexts/I18nContext';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

export const LanguageToggle = () => {
  const { language, setLanguage } = useI18n();

  const handleToggle = async () => {
    const newLang = language === 'en' ? 'pt' : 'en';
    await setLanguage(newLang);
    toast.success(`Language switched to ${newLang === 'en' ? 'English' : 'Português'}`);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm 
                 border border-border/50 hover:border-border hover:bg-background
                 transition-all duration-200 shadow-sm hover:shadow-md
                 text-xs font-medium text-foreground group"
      aria-label="Toggle language"
    >
      <Languages className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="uppercase tracking-wider">{language}</span>
    </button>
  );
};
