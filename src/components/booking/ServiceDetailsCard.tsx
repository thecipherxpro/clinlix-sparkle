import { useState } from "react";
import { Package, Clock, ChevronDown, Sparkles, Droplet, ChefHat, Sofa, Home, WandSparkles, Shirt, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ServiceDetailsCardProps {
  packageInfo: {
    package_name: string;
    time_included: string;
    bedroom_count: number;
    areas_included?: string[];
    one_time_price?: number;
    recurring_price?: number;
  };
  addons?: Array<{
    id: string;
    name_en: string;
    name_pt: string;
    price: number;
  }>;
  totalEstimate: number;
  totalFinal?: number | null;
  overtimeMinutes?: number;
  currency?: string;
  isRecurring?: boolean;
}

const getAreaIcon = (area: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    bathroom: <Droplet className="w-4 h-4 text-primary" />,
    kitchen: <ChefHat className="w-4 h-4 text-primary" />,
    livingroom: <Sofa className="w-4 h-4 text-primary" />,
    floors: <Home className="w-4 h-4 text-primary" />,
    dusting: <WandSparkles className="w-4 h-4 text-primary" />,
    surfaces: <Sparkles className="w-4 h-4 text-primary" />,
    bedroom: <Bed className="w-4 h-4 text-primary" />,
  };
  return iconMap[area] || <Sparkles className="w-4 h-4 text-primary" />;
};

export const ServiceDetailsCard = ({
  packageInfo,
  addons = [],
  totalEstimate,
  totalFinal,
  overtimeMinutes = 0,
  currency = "EUR",
  isRecurring = false,
}: ServiceDetailsCardProps) => {
  const [areasExpanded, setAreasExpanded] = useState(false);
  
  // Calculate addon total
  const addonTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  
  // Calculate base price by subtracting addons from total estimate
  const basePrice = totalEstimate - addonTotal;
  
  // Calculate overtime charge
  const overtimeCharge = (overtimeMinutes / 30) * 10;

  return (
    <Card className="hover-scale animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Service Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9 sm:h-10 gap-1">
            <TabsTrigger 
              value="overview" 
              className="text-[10px] xs:text-xs sm:text-sm transition-all duration-200 px-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="addons" 
              className="text-[10px] xs:text-xs sm:text-sm transition-all duration-200 px-2"
            >
              <span className="truncate">
                Add-ons{addons.length > 0 && ` (${addons.length})`}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="text-[10px] xs:text-xs sm:text-sm transition-all duration-200 px-2"
            >
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-semibold text-sm sm:text-base">{packageInfo.package_name}</h3>
                <Badge variant="outline" className="gap-1 text-xs">
                  <Clock className="w-3 h-3" />
                  {packageInfo.time_included}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {packageInfo.bedroom_count} Bedroom{packageInfo.bedroom_count !== 1 ? 's' : ''}
              </p>
            </div>

            {packageInfo.areas_included && packageInfo.areas_included.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreasExpanded(!areasExpanded)}
                  className="w-full justify-between px-0 h-auto py-2 hover:bg-primary/5 transition-all duration-200"
                >
                  <span className="text-xs sm:text-sm font-medium">Areas Included</span>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform duration-300", areasExpanded && "rotate-180")}
                  />
                </Button>

                {!areasExpanded ? (
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    {packageInfo.areas_included.slice(0, 3).map((area, idx) => (
                      <span key={idx} className="inline-flex items-center">
                        {getAreaIcon(area)}
                      </span>
                    ))}
                    {packageInfo.areas_included.length > 3 && (
                      <span className="text-xs">+{packageInfo.areas_included.length - 3} more</span>
                    )}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 animate-accordion-down">
                    {packageInfo.areas_included.map((area, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs sm:text-sm p-2 rounded-md bg-muted/50 border border-border/50"
                      >
                        {getAreaIcon(area)}
                        <span className="capitalize font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Add-ons Tab */}
          <TabsContent value="addons" className="mt-4 space-y-3">
            {addons.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No extra services selected
              </div>
            ) : (
              <>
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between py-2">
                    <span className="text-sm">{addon.name_en}</span>
                    <span className="text-sm font-medium">
                      {currency === "EUR" ? "€" : "$"}{addon.price.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex items-center justify-between font-semibold">
                  <span>Add-ons Total</span>
                  <span>{currency === "EUR" ? "€" : "$"}{addonTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="mt-4 space-y-3">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Base Service</span>
                  <span className="text-xs text-muted-foreground">
                    {packageInfo.package_name}
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  {currency === "EUR" ? "€" : "$"}{basePrice.toFixed(2)}
                </span>
              </div>

              {addons.length > 0 && (
                <div className="border-t pt-2.5">
                  <div className="space-y-2">
                    {addons.map((addon) => (
                      <div key={addon.id} className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{addon.name_en}</span>
                        <span className="text-xs font-medium">
                          {currency === "EUR" ? "€" : "$"}{addon.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-1 border-t">
                      <span className="text-sm font-medium">Add-ons Subtotal</span>
                      <span className="text-sm font-semibold">
                        {currency === "EUR" ? "€" : "$"}{addonTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {overtimeMinutes > 0 && (
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Overtime ({overtimeMinutes} min)
                  </span>
                  <span className="text-sm font-semibold">
                    {currency === "EUR" ? "€" : "$"}{overtimeCharge.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t-2 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-base sm:text-lg">Total Amount</span>
                <span className="font-bold text-xl sm:text-2xl text-primary">
                  {currency === "EUR" ? "€" : "$"}
                  {(totalFinal || totalEstimate).toFixed(2)}
                </span>
              </div>
              {totalFinal && totalFinal !== totalEstimate && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Original estimate: {currency === "EUR" ? "€" : "$"}{totalEstimate.toFixed(2)}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
