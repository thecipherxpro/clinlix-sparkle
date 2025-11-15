import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Check, Plus, Home, Sparkles, Clock, Euro, Bath, Languages } from "lucide-react";
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
              <div key={pkg.id} className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group h-[420px]">
                {/* Modern gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                      <Home className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{getPackageName(pkg)}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pkg.time_included} {t.minutes}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                      <p className="text-xs text-muted-foreground mb-1">{t.oneTime}</p>
                      <p className="text-2xl font-bold flex items-center gap-1">
                        <CurrencyIcon className="h-5 w-5" />
                        {pkg.one_time_price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">{t.recurring}</p>
                      <p className="text-2xl font-bold flex items-center gap-1 text-primary">
                        <CurrencyIcon className="h-5 w-5" />
                        {pkg.recurring_price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 bg-card/40 backdrop-blur-sm rounded-xl p-4 border border-border/50 mb-4">
                    <p className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {t.areasIncluded}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getTranslatedAreas(pkg.areas_included).map((area, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/customer/booking')} 
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  >
                    {t.bookNow}
                  </Button>
                </div>
              </div>
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
              <div key={addon.id} className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group h-[160px]">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-muted/30" />
                
                {/* Decorative blur */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-md flex-shrink-0">
                      <Plus className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      {language === "pt" ? addon.name_pt : addon.name_en}
                    </h3>
                  </div>
                  
                  <div className="bg-card/60 backdrop-blur-sm rounded-lg p-3 border border-border/50 inline-flex items-center gap-2 self-start">
                    <CurrencyIcon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">{addon.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default Pricing;