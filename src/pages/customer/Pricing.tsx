import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Check, Plus, Home, Sparkles, Clock, Euro, DollarSign, BedDouble, Sofa, Bath } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import pricingHeroStatic from "@/assets/pricing-hero-static.png";

const pricingData = {
  EUR: {
    currency: "€",
    language: "pt",
    country: "Portugal",
    translations: {
      title: "Modelo de Preços Clinlix",
      subtitle: "Preços fixos transparentes baseados no layout da sua propriedade",
      heroTitle: "Preços Fixos, Sem Surpresas",
      backButton: "Voltar ao Painel",
      packagePricing: "Preços dos Pacotes de Limpeza",
      packageSubtitle: "Os nossos preços são fixos baseados no layout da propriedade e número de quartos",
      oneTime: "Única vez",
      recurring: "Recorrente",
      areasIncluded: "Áreas Incluídas",
      bookNow: "Reservar Agora",
      addons: "Complementos Opcionais",
      addonsSubtitle: "Melhore o seu serviço de limpeza com estas opções adicionais",
      extraTime: "Preços de Tempo Extra",
      extraTimeDesc: "Para trabalhos maiores que requerem tempo adicional",
      timeIncrement: "Incremento de Tempo",
      pricePerIncrement: "Preço por Incremento",
      extraTimeNote: "Cobrado em incrementos de",
      extraTimeNotice: "minutos. O prestador irá notificá-lo se for necessário tempo extra antes de prosseguir.",
      readyToBook: "Pronto para Reservar?",
      readyToBookDesc: "Comece com os nossos preços transparentes e serviço profissional",
      bookYourCleaning: "Reserve a Sua Limpeza",
      minutes: "minutos"
    },
    packages: [
      {
        bedrooms: 1,
        name: "Estúdio/1-Quarto",
        code: "PKG-1BR",
        oneTimePrice: 45,
        recurringPrice: 40,
        timeIncluded: "2-3 horas",
        areas: ["Casa de Banho", "Cozinha", "Sala de Estar", "Pavimentos", "Desempoeiramento", "Superfícies"]
      },
      {
        bedrooms: 2,
        name: "2-Quartos",
        code: "PKG-2BR",
        oneTimePrice: 65,
        recurringPrice: 60,
        timeIncluded: "3-4 horas",
        areas: ["2 Casas de Banho", "Cozinha", "Sala de Estar", "2 Quartos", "Pavimentos", "Desempoeiramento", "Superfícies"]
      },
      {
        bedrooms: 3,
        name: "3-Quartos",
        code: "PKG-3BR",
        oneTimePrice: 85,
        recurringPrice: 80,
        timeIncluded: "4-5 horas",
        areas: ["2 Casas de Banho", "Cozinha", "Sala de Estar", "3 Quartos", "Pavimentos", "Desempoeiramento", "Todas as Superfícies"]
      }
    ],
    addons: [
      { name: "Limpeza Profunda", price: 25, description: "Limpeza intensiva de áreas difíceis de alcançar" },
      { name: "Lavagem de Janelas", price: 20, description: "Limpeza de janelas interior e exterior" },
      { name: "Limpeza de Carpetes", price: 30, description: "Lavagem profissional de carpetes" },
      { name: "Limpeza de Forno", price: 15, description: "Limpeza profunda do interior do forno" },
      { name: "Limpeza de Frigorífico", price: 15, description: "Limpeza completa do frigorífico por dentro e por fora" }
    ],
    overtime: {
      increment: 30,
      price: 10,
      description: "Cobrado em incrementos de"
    }
  },
  CAD: {
    currency: "$",
    language: "en",
    country: "Canada",
    translations: {
      title: "Clinlix Pricing Model",
      subtitle: "Transparent fixed pricing based on your property layout",
      heroTitle: "Fixed Pricing, No Surprises",
      backButton: "Back to Dashboard",
      packagePricing: "Cleaning Package Pricing",
      packageSubtitle: "Our prices are fixed based on property layout and number of bedrooms",
      oneTime: "One-time",
      recurring: "Recurring",
      areasIncluded: "Areas Included",
      bookNow: "Book Now",
      addons: "Optional Add-ons",
      addonsSubtitle: "Enhance your cleaning service with these additional options",
      extraTime: "Extra Time Pricing",
      extraTimeDesc: "For larger jobs requiring additional time",
      timeIncrement: "Time Increment",
      pricePerIncrement: "Price per Increment",
      extraTimeNote: "Charged in",
      extraTimeNotice: "minute increments. Provider will notify you if extra time is needed before proceeding.",
      readyToBook: "Ready to Book?",
      readyToBookDesc: "Get started with our transparent pricing and professional service",
      bookYourCleaning: "Book Your Cleaning",
      minutes: "minutes"
    },
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
  const translations = data?.translations || pricingData.EUR.translations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/customer/dashboard')}
          className="mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {translations.backButton}
        </Button>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          {translations.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {translations.subtitle}
        </p>
      </div>

      {/* Hero Image */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        <div className="relative h-48 sm:h-64 md:h-80 rounded-xl overflow-hidden shadow-xl">
          <img 
            src={pricingHeroStatic} 
            alt="Pricing Model"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-4 sm:p-6">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
                {translations.heroTitle}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Country Tabs */}
        <Tabs value={selectedCurrency} className="w-full" onValueChange={(value) => setSelectedCurrency(value as "EUR" | "CAD")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="EUR" className="text-xs sm:text-sm md:text-base">
              🇵🇹 Portugal (EUR)
            </TabsTrigger>
            <TabsTrigger value="CAD" className="text-xs sm:text-sm md:text-base">
              🇨🇦 Canada (CAD)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="EUR" className="space-y-8">
            {/* Package Pricing Section */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {pricingData.EUR.translations.packagePricing}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {pricingData.EUR.translations.packageSubtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pricingData.EUR.packages.map((pkg) => (
                  <Card key={pkg.code} className="border-2 hover:border-primary transition-all hover:shadow-lg overflow-hidden">
                    <div className={`h-3 ${pkg.bedrooms === 1 ? 'bg-blue-500' : pkg.bedrooms === 2 ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className={`w-6 h-6 sm:w-8 sm:h-8 ${pkg.bedrooms === 1 ? 'text-blue-500' : pkg.bedrooms === 2 ? 'text-green-500' : 'text-orange-500'}`} />
                          <div>
                            <CardTitle className="text-lg sm:text-xl">{pkg.bedrooms} QT</CardTitle>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {pkg.timeIncluded}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="font-semibold text-sm sm:text-base">
                        {pkg.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="space-y-3 bg-secondary/20 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{pricingData.EUR.translations.oneTime}</span>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-primary flex items-center">
                            <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
                            {pkg.oneTimePrice}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{pricingData.EUR.translations.recurring}</span>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
                            <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
                            {pkg.recurringPrice}
                          </span>
                        </div>
                      </div>

                      {/* Areas Included */}
                      <div className="pt-3 border-t">
                        <p className="text-xs font-semibold mb-3 uppercase text-muted-foreground flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          {pricingData.EUR.translations.areasIncluded}
                        </p>
                        <ul className="space-y-2">
                          {pkg.areas.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
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
                        {pricingData.EUR.translations.bookNow}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {pricingData.EUR.translations.addons}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {pricingData.EUR.translations.addonsSubtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {pricingData.EUR.addons.map((addon, idx) => (
                  <Card key={idx} className="border hover:border-primary/50 transition-all hover:shadow-md">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base">{addon.name}</h3>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-primary flex items-center">
                          <Euro className="w-4 h-4" />
                          {addon.price}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ml-10">
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
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <CardTitle className="text-lg sm:text-xl">{pricingData.EUR.translations.extraTime}</CardTitle>
                </div>
                <CardDescription>{pricingData.EUR.translations.extraTimeDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{pricingData.EUR.translations.timeIncrement}</span>
                  <span className="font-semibold">{pricingData.EUR.overtime.increment} {pricingData.EUR.translations.minutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{pricingData.EUR.translations.pricePerIncrement}</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600 flex items-center">
                    <Euro className="w-5 h-5" />
                    {pricingData.EUR.overtime.price}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                  {pricingData.EUR.translations.extraTimeNote} {pricingData.EUR.overtime.increment} {pricingData.EUR.translations.extraTimeNotice}
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{pricingData.EUR.translations.readyToBook}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {pricingData.EUR.translations.readyToBookDesc}
                </p>
                <Button 
                  size="lg"
                  className="px-6 sm:px-8"
                  onClick={() => navigate('/customer/booking')}
                >
                  {pricingData.EUR.translations.bookYourCleaning}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="CAD" className="space-y-8">
            {/* Package Pricing Section */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {pricingData.CAD.translations.packagePricing}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {pricingData.CAD.translations.packageSubtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {pricingData.CAD.packages.map((pkg) => (
                  <Card key={pkg.code} className="border-2 hover:border-primary transition-all hover:shadow-lg overflow-hidden">
                    <div className={`h-3 ${pkg.bedrooms === 1 ? 'bg-blue-500' : pkg.bedrooms === 2 ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Home className={`w-6 h-6 sm:w-8 sm:h-8 ${pkg.bedrooms === 1 ? 'text-blue-500' : pkg.bedrooms === 2 ? 'text-green-500' : 'text-orange-500'}`} />
                          <div>
                            <CardTitle className="text-lg sm:text-xl">{pkg.bedrooms} BR</CardTitle>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {pkg.timeIncluded}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="font-semibold text-sm sm:text-base">
                        {pkg.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="space-y-3 bg-secondary/20 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{pricingData.CAD.translations.oneTime}</span>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-primary flex items-center">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                            {pkg.oneTimePrice}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-600" />
                            <span className="text-xs sm:text-sm text-muted-foreground">{pricingData.CAD.translations.recurring}</span>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
                            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                            {pkg.recurringPrice}
                          </span>
                        </div>
                      </div>

                      {/* Areas Included */}
                      <div className="pt-3 border-t">
                        <p className="text-xs font-semibold mb-3 uppercase text-muted-foreground flex items-center gap-2">
                          <Bath className="w-4 h-4" />
                          {pricingData.CAD.translations.areasIncluded}
                        </p>
                        <ul className="space-y-2">
                          {pkg.areas.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
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
                        {pricingData.CAD.translations.bookNow}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {pricingData.CAD.translations.addons}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {pricingData.CAD.translations.addonsSubtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {pricingData.CAD.addons.map((addon, idx) => (
                  <Card key={idx} className="border hover:border-primary/50 transition-all hover:shadow-md">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base">{addon.name}</h3>
                        </div>
                        <span className="text-lg sm:text-xl font-bold text-primary flex items-center">
                          <DollarSign className="w-4 h-4" />
                          {addon.price}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground ml-10">
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
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <CardTitle className="text-lg sm:text-xl">{pricingData.CAD.translations.extraTime}</CardTitle>
                </div>
                <CardDescription>{pricingData.CAD.translations.extraTimeDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{pricingData.CAD.translations.timeIncrement}</span>
                  <span className="font-semibold">{pricingData.CAD.overtime.increment} {pricingData.CAD.translations.minutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{pricingData.CAD.translations.pricePerIncrement}</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-600 flex items-center">
                    <DollarSign className="w-5 h-5" />
                    {pricingData.CAD.overtime.price}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                  {pricingData.CAD.translations.extraTimeNote} {pricingData.CAD.overtime.increment} {pricingData.CAD.translations.extraTimeNotice}
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
              <CardContent className="p-6 sm:p-8 text-center">
                <h3 className="text-xl sm:text-2xl font-bold mb-3">{pricingData.CAD.translations.readyToBook}</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6">
                  {pricingData.CAD.translations.readyToBookDesc}
                </p>
                <Button 
                  size="lg"
                  className="px-6 sm:px-8"
                  onClick={() => navigate('/customer/booking')}
                >
                  {pricingData.CAD.translations.bookYourCleaning}
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