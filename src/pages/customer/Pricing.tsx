import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Check, Plus } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import Pricing3DHero from "@/components/Pricing3DHero";

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
          {data.translations.backButton}
        </Button>
        <h1 className="text-[clamp(28px,7vw,40px)] font-bold mb-2">
          {data.translations.title}
        </h1>
        <p className="text-muted-foreground text-[clamp(14px,3.5vw,18px)]">
          {data.translations.subtitle}
        </p>
      </div>

      {/* 3D Hero */}
      <div className="w-full max-w-[min(1200px,calc(100%-32px))] mx-auto px-[clamp(16px,4vw,32px)] mb-8">
        <Pricing3DHero 
          currency={data.currency}
          prices={{
            br1: data.packages[0].oneTimePrice,
            br2: data.packages[1].oneTimePrice,
            br3: data.packages[2].oneTimePrice
          }}
        />
        <div className="text-center mt-4">
          <h2 className="text-2xl sm:text-3xl font-bold">{data.translations.heroTitle}</h2>
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
                {data.translations.packagePricing}
              </h2>
              <p className="text-muted-foreground text-[clamp(14px,3.5vw,16px)] mb-6">
                {data.translations.packageSubtitle}
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
                          <span className="text-sm text-muted-foreground">{data.translations.oneTime}</span>
                          <span className="text-2xl font-bold text-primary">
                            {data.currency}{pkg.oneTimePrice}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">{data.translations.recurring}</span>
                          <span className="text-2xl font-bold text-green-600">
                            {data.currency}{pkg.recurringPrice}
                          </span>
                        </div>
                      </div>

                      {/* Areas Included */}
                      <div className="pt-4 border-t">
                        <p className="text-xs font-semibold mb-3 uppercase text-muted-foreground">
                          {data.translations.areasIncluded}
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
                        {data.translations.bookNow}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div>
              <h2 className="text-[clamp(24px,6vw,32px)] font-bold mb-2">
                {data.translations.addons}
              </h2>
              <p className="text-muted-foreground text-[clamp(14px,3.5vw,16px)] mb-6">
                {data.translations.addonsSubtitle}
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
                <CardTitle className="text-xl">{data.translations.extraTime}</CardTitle>
                <CardDescription>{data.translations.extraTimeDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{data.translations.timeIncrement}</span>
                  <span className="font-semibold">{data.overtime.increment} {data.translations.minutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{data.translations.pricePerIncrement}</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {data.currency}{data.overtime.price}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  {data.translations.extraTimeNote} {data.overtime.increment} {data.translations.extraTimeNotice}
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">{data.translations.readyToBook}</h3>
                <p className="text-muted-foreground mb-6">
                  {data.translations.readyToBookDesc}
                </p>
                <Button 
                  size="lg"
                  className="px-8"
                  onClick={() => navigate('/customer/booking')}
                >
                  {data.translations.bookYourCleaning}
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