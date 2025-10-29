import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = async (langCode: string) => {
    try {
      // Update i18n
      await i18n.changeLanguage(langCode);
      
      // Update database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ language: langCode })
          .eq('id', user.id);
        
        if (error) throw error;
        toast.success('Language updated');
      }
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language');
    }
  };
  
  return (
    <Select value={i18n.language} onValueChange={changeLanguage}>
      <SelectTrigger className="w-[180px] gap-2">
        <Globe className="h-4 w-4" />
        <SelectValue>
          <span>{currentLanguage.flag} {currentLanguage.name}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="me-2">{lang.flag}</span>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
