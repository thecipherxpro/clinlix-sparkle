import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Check, Plus } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import pricingHero from "@/assets/pricing-hero.png";

const pricingData = {
  EUR: {
    currency: "€",
    language: "en",
    country: "Portugal",
    packages: [
      {
        bedrooms: 1,
        name: "Studio/1-Bedroom",
        code: "PKG-1BR",
        oneTimePrice: 45,
        recurringPrice: 40,
        timeIncluded: "2-3 hours",
        areas: ["Bathroom", "Kitchen", "Living Room", "Floors", "Dusting", "Surfaces"]
      },
      {
        bedrooms: 2,
        name: "2-Bedroom",
        code: "PKG-2BR",
        oneTimePrice: 65,
        recurringPrice: 60,
        timeIncluded: "3-4 hours",
        areas: ["2 Bathrooms", "Kitchen", "Living Room", "2 Bedrooms", "Floors", "Dusting", "Surfaces"]
      },
      {
        bedrooms: 3,
        name: "3-Bedroom",
        code: "PKG-3BR",
        oneTimePrice: 85,
        recurringPrice: 80,
        timeIncluded: "4-5 hours",
        areas: ["2 Bathrooms", "Kitchen", "Living Room", "3 Bedrooms", "Floors", "Dusting", "All Surfaces"]
      }
    ],
    addons: [
      { name: "Deep Cleaning", price: 25, description: "Intensive cleaning of hard-to-reach areas" },
      { name: "Window Washing", price: 20, description: "Interior and exterior window cleaning" },
      { name: "Carpet Cleaning", price: 30, description: "Professional carpet shampooing" },
      { name: "Oven Cleaning", price: 15, description: "Deep oven interior cleaning" },
      { name: "Refrigerator Cleaning", price: 15, description: "Complete fridge cleaning inside and out" }
    ],
    overtime: {
      increment: 30,
      price: 10,
      description: "Additional time charged in 30-minute increments"
    }
  },
  CAD: {
    currency: "$",
    language: "en",
    country: "Canada",
    packages: [
      {
        bedrooms: 1,
        name: "Studio/1-Bedroom",
        code: "PKG-1BR",
        oneTimePrice: 70,
        recurringPrice: 65,
        timeIncluded: "2-3 hours",
        areas: ["Bathroom", "Kitchen", "Living Room", "Floors", "Dusting", "Surfaces"]
      },
      {
        bedrooms: 2,
        name: "2-Bedroom",
        code: "PKG-2BR",
        oneTimePrice: 100,
        recurringPrice: 90,
        timeIncluded: "3-4 hours",
        areas: ["2 Bathrooms", "Kitchen", "Living Room", "2 Bedrooms", "Floors", "Dusting", "Surfaces"]
      },
      {
        bedrooms: 3,
        name: "3-Bedroom",
        code: "PKG-3BR",
        oneTimePrice: 130,
        recurringPrice: 120,
        timeIncluded: "4-5 hours",
        areas: ["2 Bathrooms", "Kitchen", "Living Room", "3 Bedrooms", "Floors", "Dusting", "All Surfaces"]
      }
    ],
    addons: [
      { name: "Deep Cleaning", price: 40, description: "Intensive cleaning of hard-to-reach areas" },
      { name: "Window Washing", price: 35, description: "Interior and exterior window cleaning" },
      { name: "Carpet Cleaning", price: 50, description: "Professional carpet shampooing" },
      { name: "Oven Cleaning", price: 25, description: "Deep oven interior cleaning" },
      { name: "Refrigerator Cleaning", price: 25, description: "Complete fridge cleaning inside and out" }
    ],
    overtime: {
      increment: 30,
      price: 15,
      description: "Additional time charged in 30-minute increments"
    }
  }
};

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<"EUR" | "CAD">("EUR");
  
  const data = pricingData[selectedCurrency];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)] pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-[clamp(28px,7vw,40px)] font-bold mb-2">
          Clinlix Pricing Model
        </h1>
        <p className="text-muted-foreground text-[clamp(14px,3.5vw,18px)]">
          Transparent fixed pricing based on your property layout
        </p>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-[min(1200px,calc(100%-32px))] mx-auto px-[clamp(16px,4vw,32px)] mb-8">
        <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden">
          <img 
            src={pricingHero} 
            alt="Pricing Model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6">
              <h2 className="text-white text-2xl sm:text-3xl font-bold">Fixed Pricing, No Surprises</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-[min(1200px,calc(100%-32px))] mx-auto px-[clamp(16px,4vw,32px)] py-[clamp(20px,5vw,32px)]">
        
        {/* Country Tabs */}
        <Tabs defaultValue="EUR" className="w-full" onValueChange={(value) => setSelectedCurrency(value as "EUR" | "CAD")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="EUR" className="text-sm sm:text-base">
              🇵🇹 Portugal (EUR)
            </TabsTrigger>
            <TabsTrigger value="CAD" className="text-sm sm:text-base">
              🇨🇦 Canada (CAD)
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCurrency} className="space-y-8">
            {/* Package Pricing Section */}
            <div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-bold mb-2">
                Cleaning Package Pricing
              </h2>
              <p className="text-muted-foreground text-[clamp(14px,3.5vw,16px)] mb-6">
                Our prices are fixed based on property layout and number of bedrooms
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.packages.map((pkg) => (
                  <Card key={pkg.code} className="border-2 hover:border-primary transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl">{pkg.bedrooms} BR</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {pkg.timeIncluded}
                        </span>
                      </div>
                      <CardDescription className="font-semibold text-lg">
                        {pkg.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">One-time</span>
                          <span className="text-2xl font-bold text-primary">
                            {data.currency}{pkg.oneTimePrice}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">Recurring</span>
                          <span className="text-2xl font-bold text-green-600">
                            {data.currency}{pkg.recurringPrice}
                          </span>
                        </div>
                      </div>

                      {/* Areas Included */}
                      <div className="pt-4 border-t">
                        <p className="text-xs font-semibold mb-3 uppercase text-muted-foreground">
                          Areas Included
                        </p>
                        <ul className="space-y-2">
                          {pkg.areas.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className="w-full mt-4"
                        onClick={() => navigate('/customer/booking')}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-bold mb-2">
                Optional Add-ons
              </h2>
              <p className="text-muted-foreground text-[clamp(14px,3.5vw,16px)] mb-6">
                Enhance your cleaning service with these additional options
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.addons.map((addon, idx) => (
                  <Card key={idx} className="border hover:border-primary/50 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Plus className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-base">{addon.name}</h3>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          {data.currency}{addon.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addon.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Overtime Pricing */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-xl">Extra Time Pricing</CardTitle>
                <CardDescription>For larger jobs requiring additional time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Time Increment</span>
                  <span className="font-semibold">{data.overtime.increment} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price per Increment</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {data.currency}{data.overtime.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  {data.overtime.description}. Provider will notify you if extra time is needed before proceeding.
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Book?</h3>
                <p className="text-muted-foreground mb-6">
                  Get started with our transparent pricing and professional service
                </p>
                <Button 
                  size="lg"
                  className="px-8"
                  onClick={() => navigate('/customer/booking')}
                >
                  Book Your Cleaning
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
};

export default Pricing;