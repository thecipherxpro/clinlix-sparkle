# Responsive Design System

## Overview
This application implements a **mobile-first responsive design** approach, ensuring optimal user experience across all device sizes from 320px to 1920px+.

## Breakpoints

### Tailwind Breakpoints
```
xs:  320px  - Extra small devices (small phones)
sm:  480px  - Small devices (phones)
md:  768px  - Medium devices (tablets)
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large devices (large desktops)
2xl: 1536px - Ultra large devices
```

### Usage
All styles should be applied mobile-first, then enhanced for larger screens:
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Mobile first, then tablet, then desktop
</div>
```

## Touch Targets

### Minimum Size Requirements
- **All interactive elements**: 44px × 44px minimum (WCAG 2.1 AA)
- **Buttons**: Automatically enforced via base styles
- **Links**: Use `.touch-target` utility when needed

### Implementation
```jsx
// Already enforced globally in index.css
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

## Utility Classes

### Responsive Containers
```jsx
// Mobile-optimized container with responsive padding
<div className="mobile-container">
  // px-4 sm:px-6 md:px-8, max-width-7xl, centered
</div>

// Section with responsive vertical & horizontal spacing
<div className="mobile-section">
  // py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8
</div>
```

### Responsive Typography
```jsx
<h1 className="text-responsive-2xl">Large Heading</h1>  // text-2xl sm:text-3xl md:text-4xl
<h2 className="text-responsive-xl">Medium Heading</h2>  // text-xl sm:text-2xl md:text-3xl
<h3 className="text-responsive-lg">Small Heading</h3>   // text-lg sm:text-xl md:text-2xl
<p className="text-responsive-base">Body Text</p>       // text-base sm:text-lg
<span className="text-responsive-sm">Small Text</span>  // text-sm sm:text-base
<small className="text-responsive-xs">Tiny Text</small> // text-xs sm:text-sm
```

### Responsive Cards
```jsx
// Mobile-optimized card with responsive padding & radius
<Card className="mobile-card">
  // rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6
</Card>

// Alternative: Full responsive card
<Card className="card-responsive">
  // p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl
</Card>
```

### Responsive Grids
```jsx
// 1 column mobile, 2 tablet, 3 desktop
<div className="grid-responsive">
  // grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
</div>

// 1 column mobile, 2 columns desktop
<div className="grid-responsive-2">
  // grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6
</div>
```

### Responsive Spacing
```jsx
// Responsive gap between flex/grid items
<div className="flex gap-responsive">
  // gap-3 sm:gap-4 md:gap-6
</div>

// Responsive vertical spacing between children
<div className="space-y-responsive">
  // > * + * { margin-top: 0.75rem sm:1rem md:1.5rem }
</div>
```

### Responsive Buttons
```jsx
<Button className="btn-responsive">
  // px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-sm sm:text-base
</Button>
```

### Visibility Utilities
```jsx
// Hide on mobile, show on desktop
<div className="hide-mobile">Desktop only content</div>

// Show on mobile, hide on desktop
<div className="show-mobile">Mobile only content</div>

// Standard Tailwind
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>
```

### Flex Direction
```jsx
// Column on mobile, row on larger screens
<div className="flex flex-responsive">
  // flex-col sm:flex-row
</div>
```

## Mobile Navigation

### Bottom Navigation
- Sticky bottom navigation for mobile devices
- Automatically hidden on desktop (md breakpoint)
- Uses `safe-bottom` for notch compatibility

```jsx
import MobileNav from "@/components/MobileNav";
import ProviderMobileNav from "@/components/ProviderMobileNav";

// Add to page layout
<div className="pb-mobile-nav">
  {/* Content */}
</div>
<MobileNav /> // or <ProviderMobileNav />
```

### Safe Areas
For devices with notches (iPhone X+):
```jsx
<nav className="safe-top">Navigation</nav>
<main className="safe-left safe-right">Content</main>
<footer className="safe-bottom">Footer</footer>
```

## Input Optimization

### iOS Zoom Prevention
All inputs use `font-size: 16px` minimum to prevent iOS auto-zoom:
```css
input, textarea, select {
  font-size: 16px; /* Already enforced globally */
}
```

### Touch Optimization
```css
html {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
```

## Component Guidelines

### Cards
```jsx
// Mobile-friendly card
<Card className="p-4 sm:p-5 md:p-6">
  <CardHeader className="pb-3 sm:pb-4">
    <CardTitle className="text-lg sm:text-xl md:text-2xl">
      Responsive Title
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-3 sm:space-y-4">
    Content
  </CardContent>
</Card>
```

### Buttons
```jsx
// Full width on mobile, auto on desktop
<Button className="w-full md:w-auto">
  Responsive Button
</Button>

// Responsive size
<Button size="sm" className="sm:size-default md:size-lg">
  Size Changes
</Button>
```

### Forms
```jsx
// Stack on mobile, side-by-side on desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label>First Name</Label>
    <Input />
  </div>
  <div>
    <Label>Last Name</Label>
    <Input />
  </div>
</div>
```

### Images
```jsx
// Responsive image sizing
<img 
  src={image} 
  alt="Description"
  className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
/>
```

## Testing Checklist

### Device Sizes to Test
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13/14 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad Mini (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)

### Orientation Testing
- [ ] Portrait mode
- [ ] Landscape mode

### Touch Target Verification
- [ ] All buttons minimum 44px
- [ ] All links minimum 44px
- [ ] Form inputs properly sized
- [ ] Icon buttons have adequate spacing

### Layout Checks
- [ ] No horizontal scrolling
- [ ] Text remains readable
- [ ] Images scale properly
- [ ] Navigation works correctly
- [ ] Forms are usable
- [ ] Tables scroll horizontally on small screens

## Performance Considerations

### Mobile Network Optimization
- Images use responsive sizes
- Lazy loading implemented where appropriate
- Critical CSS inlined
- Bundle size optimized

### Loading States
Always provide loading states for better perceived performance:
```jsx
{loading ? (
  <div className="animate-pulse">
    <div className="h-20 bg-muted rounded"></div>
  </div>
) : (
  <Content />
)}
```

## Accessibility

### WCAG 2.1 Compliance
- ✅ Touch targets 44px minimum
- ✅ Text scalable up to 200%
- ✅ Color contrast ratios meet AA standards
- ✅ Focus indicators visible
- ✅ Semantic HTML used throughout

### Screen Reader Support
- Use semantic HTML tags
- Provide alt text for images
- Label form inputs properly
- Use ARIA attributes when needed

## Best Practices

### DO ✅
- Start with mobile styles, enhance for desktop
- Use semantic HTML elements
- Test on real devices when possible
- Maintain consistent spacing scale
- Use design system tokens
- Optimize images for mobile

### DON'T ❌
- Use fixed pixel widths for containers
- Ignore touch target sizes
- Rely solely on hover states
- Use `max-width` queries (use `min-width`)
- Forget about landscape orientation
- Ignore safe area insets on notched devices

## Common Patterns

### Hero Section
```jsx
<section className="mobile-section text-center">
  <h1 className="text-responsive-2xl font-bold mb-4">
    Welcome
  </h1>
  <p className="text-responsive-base text-muted-foreground mb-6">
    Description text
  </p>
  <Button className="w-full sm:w-auto btn-responsive">
    Get Started
  </Button>
</section>
```

### Dashboard Cards
```jsx
<div className="grid-responsive">
  {items.map(item => (
    <Card key={item.id} className="mobile-card hover:shadow-lg transition-shadow">
      <CardContent>
        <h3 className="text-responsive-lg font-semibold mb-2">
          {item.title}
        </h3>
        <p className="text-responsive-sm text-muted-foreground">
          {item.description}
        </p>
      </CardContent>
    </Card>
  ))}
</div>
```

### Navigation Header
```jsx
<header className="sticky top-0 bg-card border-b safe-top z-50">
  <div className="mobile-container h-16 flex items-center justify-between">
    <Logo className="h-8 w-auto" />
    <nav className="hide-mobile">
      <NavigationMenu />
    </nav>
    <Button className="show-mobile" variant="ghost" size="icon">
      <Menu />
    </Button>
  </div>
</header>
```

## Resources

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile First Design](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/Mobile_first)
- [Touch Target Sizes](https://web.dev/accessible-tap-targets/)
