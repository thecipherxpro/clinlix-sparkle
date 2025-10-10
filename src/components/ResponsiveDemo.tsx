import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, User, Star, Home } from "lucide-react";

/**
 * ResponsiveDemo Component
 * 
 * This component demonstrates responsive design patterns used throughout the application.
 * Use this as a reference when building new features.
 */
export default function ResponsiveDemo() {
  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      {/* Hero Section - Mobile First */}
      <section className="mobile-section bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="mobile-container text-center">
          <h1 className="text-responsive-2xl font-bold mb-4">
            Responsive Design Demo
          </h1>
          <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto mb-6">
            This page demonstrates responsive design patterns. Resize your browser or view on different devices.
          </p>
          <div className="flex flex-responsive gap-responsive justify-center">
            <Button className="w-full sm:w-auto">Primary Action</Button>
            <Button variant="outline" className="w-full sm:w-auto">Secondary</Button>
          </div>
        </div>
      </section>

      {/* Grid Examples */}
      <section className="mobile-section">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Responsive Grids
          </h2>

          {/* 3-Column Grid */}
          <h3 className="text-responsive-lg mb-4">1 → 2 → 3 Columns</h3>
          <div className="grid-responsive mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="mobile-card">
                <CardHeader>
                  <CardTitle className="text-responsive-base">Card {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-responsive-sm text-muted-foreground">
                    This card adapts from 1 column on mobile to 3 on desktop.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 2-Column Grid */}
          <h3 className="text-responsive-lg mb-4">1 → 2 Columns</h3>
          <div className="grid-responsive-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="card-responsive">
                <CardHeader>
                  <CardTitle className="text-responsive-base">Item {i}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-responsive-sm text-muted-foreground">
                    Stacks on mobile, side-by-side on tablet+.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className="mobile-section bg-muted/30">
        <div className="mobile-container max-w-2xl">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Responsive Form
          </h2>
          <Card className="card-responsive">
            <CardHeader>
              <CardTitle className="text-responsive-lg">Contact Form</CardTitle>
              <CardDescription className="text-responsive-sm">
                Form fields adapt to screen size
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Input id="message" placeholder="Your message..." />
              </div>
              <Button className="w-full md:w-auto btn-responsive">
                Submit Form
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="mobile-section">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Typography Scale
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-2xl</p>
              <h1 className="text-responsive-2xl font-bold">The quick brown fox</h1>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-xl</p>
              <h2 className="text-responsive-xl font-semibold">The quick brown fox</h2>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-lg</p>
              <h3 className="text-responsive-lg font-semibold">The quick brown fox</h3>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-base</p>
              <p className="text-responsive-base">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-sm</p>
              <p className="text-responsive-sm">The quick brown fox jumps over the lazy dog</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">text-responsive-xs</p>
              <p className="text-responsive-xs">The quick brown fox jumps over the lazy dog</p>
            </div>
          </div>
        </div>
      </section>

      {/* Button Sizes */}
      <section className="mobile-section bg-muted/30">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Button Sizes (44px touch targets)
          </h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="lg">Large Button</Button>
            <Button size="default">Default Button</Button>
            <Button size="sm">Small Button</Button>
            <Button size="icon">
              <Home />
            </Button>
          </div>
          <p className="text-responsive-sm text-muted-foreground mt-4">
            All buttons meet WCAG 2.1 minimum touch target size of 44px
          </p>
        </div>
      </section>

      {/* Icons Grid */}
      <section className="mobile-section">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Touch Targets with Icons
          </h2>
          <div className="flex flex-wrap gap-3">
            {[Calendar, MapPin, User, Star, Home].map((Icon, i) => (
              <Button key={i} variant="outline" size="icon" className="touch-target">
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Visibility Demo */}
      <section className="mobile-section bg-muted/30">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Responsive Visibility
          </h2>
          <div className="space-y-4">
            <Card className="show-mobile border-primary">
              <CardContent className="p-4">
                <p className="text-responsive-sm font-semibold text-primary">
                  📱 Mobile Only Content - Hidden on desktop (md:hidden)
                </p>
              </CardContent>
            </Card>
            <Card className="hide-mobile border-green-500">
              <CardContent className="p-4">
                <p className="text-responsive-sm font-semibold text-green-600">
                  💻 Desktop Only Content - Hidden on mobile (hidden md:block)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-responsive-sm font-semibold">
                  👀 Always Visible - Shows on all screen sizes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Spacing Demo */}
      <section className="mobile-section">
        <div className="mobile-container">
          <h2 className="text-responsive-xl font-semibold mb-6">
            Responsive Spacing
          </h2>
          <div className="space-y-responsive">
            <Card className="mobile-card">
              <CardContent>
                <p className="text-responsive-sm">Item with space-y-responsive</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent>
                <p className="text-responsive-sm">Spacing adapts to screen size</p>
              </CardContent>
            </Card>
            <Card className="mobile-card">
              <CardContent>
                <p className="text-responsive-sm">Smaller on mobile, larger on desktop</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
