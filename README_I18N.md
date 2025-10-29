# Internationalization (i18n) Implementation

This application now has comprehensive internationalization support with the following features:

## 🌍 Supported Languages

- **English** (en) 🇬🇧
- **Spanish** (es) 🇪🇸
- **French** (fr) 🇫🇷
- **Portuguese - European** (pt-PT) 🇵🇹
- **Arabic** (ar) 🇸🇦 - with RTL support

## 📦 Implementation Overview

### Core Libraries
- `i18next` - Core internationalization framework
- `react-i18next` - React bindings for i18next
- `i18next-browser-languagedetector` - Automatic language detection
- `i18next-http-backend` - Dynamic translation loading
- `date-fns` & `date-fns-tz` - Date/time formatting
- `tailwindcss-rtl` - RTL layout support

### Features Implemented

#### ✅ Phase 1-2: Text Translation
- Translation key management system
- Namespace organization (common, auth, booking, provider, customer, errors)
- Type-safe translation keys with TypeScript
- Automatic language detection and persistence
- Translation files in `/public/locales/{lang}/{namespace}.json`

#### ✅ Phase 3: Date/Time & Number Formatting
- **Hooks Created:**
  - `useFormatDate` - Locale-aware date formatting
  - `useFormatNumber` - Number, currency, and percentage formatting
  
- **Date Formatting Functions:**
  - `formatDate(date, format)` - Basic date formatting
  - `formatDateTime(date, format)` - Date with time
  - `formatTime(date, format)` - Time only
  - `formatRelative(date)` - Relative time (e.g., "2 hours ago")
  - `formatWithTimezone(date, timezone, format)` - Timezone-aware formatting

- **Number Formatting Functions:**
  - `formatNumber(value, options)` - Basic number formatting
  - `formatCurrency(value, currency)` - Currency formatting (e.g., $1,234.56)
  - `formatPercent(value, decimals)` - Percentage formatting
  - `formatCompact(value)` - Compact notation (e.g., 1.2K, 3.4M)

#### ✅ Phase 4: RTL Layout Support
- Automatic direction detection with `useDirection` hook
- Document-level `dir` and `lang` attribute management
- Tailwind RTL plugin integrated
- Logical CSS properties support (`ms`, `me` for start/end)
- RTL support for Arabic and Hebrew languages

#### ✅ Phase 5-8: Tools & Utilities
- **Language Switcher Component** - Easy language selection UI
- **Translation Extraction Script** - Scan codebase for translation keys
- **I18n Layout Wrapper** - Automatic direction management
- **TypeScript Type Definitions** - Type-safe translation keys

## 🚀 Usage

### Basic Translation

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common:app.name')}</h1>
      <p>{t('common:app.tagline')}</p>
    </div>
  );
}
```

### With Specific Namespace

```tsx
import { useTranslation } from 'react-i18next';

function AuthForm() {
  const { t } = useTranslation('auth');
  
  return (
    <form>
      <input placeholder={t('emailPlaceholder')} />
      <button>{t('signIn')}</button>
    </form>
  );
}
```

### Date Formatting

```tsx
import { useFormatDate } from '@/hooks/useFormatDate';

function BookingCard({ booking }) {
  const { formatDate, formatRelative } = useFormatDate();
  
  return (
    <div>
      <p>{formatDate(booking.date, 'PPP')}</p>
      <p>{formatRelative(booking.createdAt)}</p>
    </div>
  );
}
```

### Number & Currency Formatting

```tsx
import { useFormatNumber } from '@/hooks/useFormatNumber';

function PriceDisplay({ amount, currency }) {
  const { formatCurrency, formatPercent } = useFormatNumber();
  
  return (
    <div>
      <p>{formatCurrency(amount, currency)}</p>
      <p>Tax: {formatPercent(0.15)}</p>
    </div>
  );
}
```

### Language Switcher

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation items */}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
```

### RTL Support

```tsx
import { useDirection } from '@/hooks/useDirection';

function MyComponent() {
  const { direction, isRTL } = useDirection();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      {/* Your content - direction is automatically applied to document */}
      {/* Use logical properties: ms-4 (margin-start) instead of ml-4 */}
      <div className="ms-4 me-2">Content</div>
    </div>
  );
}
```

## 📁 File Structure

```
public/
  locales/
    en/
      common.json
      auth.json
      booking.json
      provider.json
      customer.json
      errors.json
    es/
      common.json
      ...
    pt-PT/
      common.json
      ...
    ar/
      common.json
      ...

src/
  lib/
    i18n.ts              # i18next configuration
  hooks/
    useDirection.tsx     # RTL/LTR direction hook
    useFormatDate.tsx    # Date formatting hook
    useFormatNumber.tsx  # Number formatting hook
  components/
    LanguageSwitcher.tsx # Language selection UI
    layouts/
      I18nLayout.tsx     # i18n wrapper component
  types/
    i18n.d.ts           # TypeScript type definitions

scripts/
  extract-translations.js # Translation key extraction tool
```

## 🛠️ Development Workflow

### Adding New Translations

1. **Add keys to English translation files** (`public/locales/en/*.json`)
2. **Use the extraction script** to find all translation keys:
   ```bash
   node scripts/extract-translations.js
   ```
3. **Copy structure to other language files** and translate values
4. **Use TypeScript** to ensure type safety

### Translation Best Practices

1. **Use namespaces** to organize translations logically
2. **Keep keys semantic** (e.g., `auth.signIn` not `auth.button1`)
3. **Use interpolation** for dynamic content:
   ```json
   {
     "welcome": "Welcome, {{name}}!"
   }
   ```
   ```tsx
   t('welcome', { name: user.name })
   ```
4. **Handle pluralization**:
   ```json
   {
     "items": "{{count}} item",
     "items_other": "{{count}} items"
   }
   ```
   ```tsx
   t('items', { count: 5 })
   ```

### European Portuguese Requirement

The configuration ensures European Portuguese (pt-PT) is used, NOT Brazilian Portuguese (pt-BR). The system:
- Uses locale code `pt-PT` explicitly
- Loads translations from `public/locales/pt-PT/`
- Uses European Portuguese date-fns locale

## 🧪 Testing

The implementation includes:
- **Type safety** for translation keys
- **Automatic language detection** from browser/localStorage
- **Fallback to English** if translation missing
- **Development warnings** for missing keys (in dev mode)

### Manual Testing Checklist
- [ ] Language switcher changes language
- [ ] Language persists on page reload
- [ ] All text translates correctly
- [ ] Date formats match locale
- [ ] Currency formats match locale
- [ ] RTL layout works for Arabic
- [ ] No console warnings for missing keys

## 🎨 RTL Styling

Use Tailwind's logical properties for RTL-friendly styles:

```tsx
// ❌ Don't use directional properties
<div className="ml-4 mr-2 text-left">

// ✅ Use logical properties
<div className="ms-4 me-2 text-start">
```

**Logical Property Reference:**
- `ms-*` = margin-start (left in LTR, right in RTL)
- `me-*` = margin-end (right in LTR, left in RTL)
- `ps-*` = padding-start
- `pe-*` = padding-end
- `text-start` = text-left in LTR, text-right in RTL
- `text-end` = text-right in LTR, text-left in RTL

## 📊 Performance

- **Lazy loading** of translation files per namespace
- **Caching** in localStorage for faster subsequent loads
- **Suspense boundaries** for smooth loading experience
- **Bundle impact**: ~50KB (gzipped) for core i18n libraries

## 🔗 Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [date-fns Documentation](https://date-fns.org/)
- [Tailwind RTL Plugin](https://github.com/20lives/tailwindcss-rtl)

## 🚀 Next Steps

To fully integrate i18n into your application:

1. **Add LanguageSwitcher to your header/navigation**
2. **Wrap components with translation hooks**
3. **Replace hardcoded strings** with `t()` function calls
4. **Update date/time displays** to use `useFormatDate`
5. **Update currency displays** to use `useFormatNumber`
6. **Test RTL layout** with Arabic language
7. **Add missing translations** for new features

---

**Note:** All core infrastructure is in place. You can now start translating your application by wrapping components with `useTranslation()` and replacing text with translation keys.
