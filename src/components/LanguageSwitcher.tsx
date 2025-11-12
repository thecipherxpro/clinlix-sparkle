import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = async (newLang: 'en' | 'pt') => {
    await setLanguage(newLang);
    toast.success(t('settings.changesSaved'));
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇬🇧 English</SelectItem>
        <SelectItem value="pt">🇵🇹 Português</SelectItem>
      </SelectContent>
    </Select>
  );
};