# Internationalization (i18n) System

This application supports **English (en)** and **Portuguese - Portugal (pt)** languages with full integration to user profile settings.

## Features

- ✅ Automatic language detection from user profile
- ✅ Persistent language preference stored in database
- ✅ Seamless language switching without page reload
- ✅ Fallback to English for missing translations
- ✅ LocalStorage backup for language preference
- ✅ Type-safe translation keys with TypeScript

## Architecture

### Files Structure

```
src/
├── i18n/
│   └── translations.ts          # All translation strings
├── contexts/
│   └── I18nContext.tsx          # Language state management
├── components/
│   └── LanguageSwitcher.tsx     # Language selector component
└── hooks/
    └── useTranslation.ts        # Convenience hook (re-export)
```

## Usage

### 1. Using Translations in Components

```tsx
import { useI18n } from '@/contexts/I18nContext';

function MyComponent() {
  const { t, language } = useI18n();
  
  return (
    <div>
      <h1>{t.auth.welcomeBack}</h1>
      <p>{t.common.loading}</p>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### 2. Changing Language Programmatically

```tsx
import { useI18n } from '@/contexts/I18nContext';

function LanguageButton() {
  const { setLanguage } = useI18n();
  
  const switchToPortuguese = async () => {
    await setLanguage('pt');
  };
  
  return <button onClick={switchToPortuguese}>Switch to PT</button>;
}
```

### 3. Using the LanguageSwitcher Component

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

## Translation Keys Structure

All translations are organized into logical groups:

- **auth**: Authentication pages (login, signup, password reset)
- **common**: Common UI elements (buttons, labels, actions)
- **dashboard**: Dashboard-related content
- **settings**: Settings page content
- **provider**: Provider-specific content
- **booking**: Booking-related content
- **errors**: Error messages

### Example Translation Access

```tsx
t.auth.signIn          // "Sign In" or "Entrar"
t.common.save          // "Save" or "Guardar"
t.settings.title       // "Settings" or "Definições"
t.provider.myJobs      // "My Jobs" or "Os Meus Trabalhos"
t.errors.generic       // "Something went wrong" or "Algo correu mal"
```

## Adding New Translations

### 1. Update the TranslationStructure interface in `src/i18n/translations.ts`

```typescript
interface TranslationStructure {
  // ... existing sections
  newSection: {
    newKey: string;
    anotherKey: string;
  };
}
```

### 2. Add translations for both languages

```typescript
export const translations: Record<Language, TranslationStructure> = {
  en: {
    // ... existing translations
    newSection: {
      newKey: 'My English Text',
      anotherKey: 'Another Text',
    },
  },
  pt: {
    // ... existing translations
    newSection: {
      newKey: 'Meu Texto em Português',
      anotherKey: 'Outro Texto',
    },
  },
};
```

### 3. Use in your component

```tsx
const { t } = useI18n();
console.log(t.newSection.newKey);
```

## How It Works

### Initialization Flow

1. **App Starts**: `I18nProvider` wraps the entire application
2. **Load User Preference**: Fetches language from user's profile in database
3. **Fallback**: If no user logged in or error, defaults to English
4. **LocalStorage Backup**: Stores preference in localStorage as backup

### Language Change Flow

1. **User Selects Language**: Via `LanguageSwitcher` or `setLanguage()`
2. **Update Database**: Saves to user's profile in Supabase
3. **Update Local State**: Immediately updates UI
4. **LocalStorage Backup**: Updates localStorage for offline access
5. **Toast Notification**: Shows success message

### Database Integration

Language preference is stored in the `profiles` table:

```sql
profiles {
  id: uuid
  language: text  -- 'en' or 'pt'
  -- other fields...
}
```

## TypeScript Support

The system is fully typed:

```typescript
type Language = 'en' | 'pt';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: TranslationKeys;
  isLoading: boolean;
}
```

## Best Practices

1. **Always use translation keys**: Never hardcode user-facing text
2. **Add translations simultaneously**: When adding new keys, provide both EN and PT
3. **Use semantic key names**: Make keys descriptive (e.g., `auth.signIn` not `btn1`)
4. **Group related translations**: Keep translations organized by feature
5. **Handle loading states**: Use `isLoading` to show loading indicators
6. **Test both languages**: Always test features in both English and Portuguese

## Error Handling

The system gracefully handles errors:

- Database connection failures → Falls back to localStorage
- Missing translations → TypeScript catches at compile time
- Invalid language codes → Defaults to English
- Authentication errors → Continues with default language

## Performance

- Language preference is loaded once on app initialization
- Translations are bundled at build time (no runtime fetching)
- Language changes update instantly without page reload
- LocalStorage provides offline-first experience

## Future Enhancements

Potential improvements:

- [ ] Add more languages
- [ ] Lazy load translations per route
- [ ] Extract translations to JSON files
- [ ] Add pluralization support
- [ ] Add date/time formatting per locale
- [ ] Add number formatting per locale
- [ ] Add RTL support for future languages
