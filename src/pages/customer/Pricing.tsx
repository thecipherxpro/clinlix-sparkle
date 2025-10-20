import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Check, Plus, Home, Sparkles, Clock, Euro, Bath, Languages } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import pricingHeroStatic from "@/assets/pricing-hero-static.png";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const translations = {
  pt: {
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
    minutes: "minutos",
    bedrooms: "quartos",
    bedroom: "quarto",
    studio: "Estúdio",
    language: "Idioma"
  },
  en: {
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
    minutes: "minutes",
    bedrooms: "bedrooms",
    bedroom: "bedroom",
    studio: "Studio",
    language: "Language"
  }
};

const areaTranslations: Record<string, { pt: string; en: string }> = {
  bathroom: { pt: "Casa de Banho", en: "Bathroom" },
  kitchen: { pt: "Cozinha", en: "Kitchen" },
  livingroom: { pt: "Sala de Estar", en: "Living Room" },
  floors: { pt: "Pavimentos", en: "Floors" },
  dusting: { pt: "Desempoeiramento", en: "Dusting" },
  surfaces: { pt: "Superfícies", en: "Surfaces" }
};

const Pricing = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"pt" | "en">("pt");
  const [packages, setPackages] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [overtimeRule, setOvertimeRule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const t = translations[language];
  const currencySymbol = "€";
  const CurrencyIcon = Euro;

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const [packagesRes, addonsRes, overtimeRes] = await Promise.all([
        supabase.from("cleaning_packages").select("*").order("bedroom_count"),
        supabase.from("cleaning_addons").select("*").order("type, price"),
        supabase.from("overtime_rules").select("*").limit(1).single()
      ]);

      if (packagesRes.error) throw packagesRes.error;
      if (addonsRes.error) throw addonsRes.error;
      if (overtimeRes.error) throw overtimeRes.error;

      setPackages(packagesRes.data || []);
      setAddons(addonsRes.data || []);
      setOvertimeRule(overtimeRes.data);
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      toast.error("Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  const getPackageName = (pkg: any) => {
    if (pkg.bedroom_count === 0) {
      return t.studio;
    }
    const bedroomWord = pkg.bedroom_count === 1 ? t.bedroom : t.bedrooms;
    return `${pkg.bedroom_count} ${bedroomWord}`;
  };

  const getTranslatedAreas = (areas: string[]) => {
    return areas.map(area => areaTranslations[area]?.[language] || area);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <div className="w-full px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/customer/dashboard')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t.backButton}
          </Button>
          
          {/* Language Toggle */}
          <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-lg">
            <Languages className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="language-toggle" className="text-sm font-medium cursor-pointer">
              {language === "pt" ? "PT" : "EN"}
            </Label>
            <Switch
              id="language-toggle"
              checked={language === "en"}
              onCheckedChange={(checked) => setLanguage(checked ? "en" : "pt")}
            />
          </div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          {t.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t.subtitle}
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
                {t.heroTitle}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Package Pricing Section */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {t.packagePricing}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            {t.packageSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="border-2 hover:border-primary transition-all hover:shadow-lg overflow-hidden">
                <div className={`h-3 ${
                  pkg.bedroom_count === 0 ? 'bg-purple-500' : 
                  pkg.bedroom_count === 1 ? 'bg-blue-500' : 
                  pkg.bedroom_count === 2 ? 'bg-green-500' : 
                  pkg.bedroom_count === 3 ? 'bg-orange-500' : 'bg-red-500'
                }`} />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Home className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        pkg.bedroom_count === 0 ? 'text-purple-500' : 
                        pkg.bedroom_count === 1 ? 'text-blue-500' : 
                        pkg.bedroom_count === 2 ? 'text-green-500' : 
                        pkg.bedroom_count === 3 ? 'text-orange-500' : 'text-red-500'
                      }`} />
                      <div>
                        <CardTitle className="text-lg sm:text-xl">{getPackageName(pkg)}</CardTitle>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {pkg.time_included}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div className="space-y-3 bg-secondary/20 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{t.oneTime}</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-primary flex items-center">
                        <CurrencyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        {pkg.one_time_price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-xs sm:text-sm text-muted-foreground">{t.recurring}</span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold text-green-600 flex items-center">
                        <CurrencyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        {pkg.recurring_price}
                      </span>
                    </div>
                  </div>

                  {/* Areas Included */}
                  <div className="pt-3 border-t">
                    <p className="text-xs font-semibold mb-3 uppercase text-muted-foreground flex items-center gap-2">
                      <Bath className="w-4 h-4" />
                      {t.areasIncluded}
                    </p>
                    <ul className="space-y-2">
                      {getTranslatedAreas(pkg.areas_included).map((area: string, idx: number) => (
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
                    {t.bookNow}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {t.addons}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            {t.addonsSubtitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {addons.map((addon) => (
              <Card key={addon.id} className="border hover:border-primary/50 transition-all hover:shadow-md">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base">
                        {language === "pt" ? addon.name_pt : addon.name_en}
                      </h3>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-primary flex items-center">
                      <CurrencyIcon className="w-4 h-4" />
                      {addon.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overtime Pricing */}
        {overtimeRule && (
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 border-orange-200 dark:border-orange-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                <CardTitle className="text-lg sm:text-xl">{t.extraTime}</CardTitle>
              </div>
              <CardDescription>{t.extraTimeDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.timeIncrement}</span>
                <span className="font-semibold">{overtimeRule.increment_minutes} {t.minutes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.pricePerIncrement}</span>
                <span className="text-xl sm:text-2xl font-bold text-orange-600 flex items-center">
                  <CurrencyIcon className="w-5 h-5" />
                  {overtimeRule.price_eur}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 border-t">
                {t.extraTimeNote} {overtimeRule.increment_minutes} {t.extraTimeNotice}
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-0">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">{t.readyToBook}</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              {t.readyToBookDesc}
            </p>
            <Button 
              size="lg"
              className="px-6 sm:px-8"
              onClick={() => navigate('/customer/booking')}
            >
              {t.bookYourCleaning}
            </Button>
          </CardContent>
        </Card>
      </main>

      <MobileNav />
    </div>
  );
};

export default Pricing;