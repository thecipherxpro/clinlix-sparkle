import { useState } from "react";
import { Package, Clock, ChevronDown, Sparkles } from "lucide-react";
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
}

const areaIcons: Record<string, string> = {
  bathroom: "🚿",
  kitchen: "🍳",
  livingroom: "🛋️",
  floors: "🏠",
  dusting: "✨",
  surfaces: "🧽",
  bedroom: "🛏️",
};

export const ServiceDetailsCard = ({
  packageInfo,
  addons = [],
  totalEstimate,
  totalFinal,
  overtimeMinutes = 0,
  currency = "EUR",
}: ServiceDetailsCardProps) => {
  const [areasExpanded, setAreasExpanded] = useState(false);
  
  const basePrice = totalEstimate;
  const addonTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
  const overtimeCharge = (overtimeMinutes / 30) * 10;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Service Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="addons" className="text-xs sm:text-sm">
              Add-ons {addons.length > 0 && `(${addons.length})`}
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs sm:text-sm">Payment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-base">{packageInfo.package_name}</h3>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {packageInfo.time_included}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {packageInfo.bedroom_count} Bedroom{packageInfo.bedroom_count !== 1 ? 's' : ''}
              </p>
            </div>

            {packageInfo.areas_included && packageInfo.areas_included.length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAreasExpanded(!areasExpanded)}
                  className="w-full justify-between px-0 hover:bg-transparent"
                >
                  <span className="text-sm font-medium">Areas Included</span>
                  <ChevronDown
                    className={cn("w-4 h-4 transition-transform", areasExpanded && "rotate-180")}
                  />
                </Button>

                {!areasExpanded ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    {packageInfo.areas_included.slice(0, 3).map(area => areaIcons[area] || '•').join(' ')}
                    {packageInfo.areas_included.length > 3 && ` +${packageInfo.areas_included.length - 3} more`}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {packageInfo.areas_included.map((area, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span>{areaIcons[area] || '•'}</span>
                        <span className="capitalize">{area}</span>
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Service</span>
                <span>{currency === "EUR" ? "€" : "$"}{basePrice.toFixed(2)}</span>
              </div>

              {addons.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Add-ons</span>
                  <span>{currency === "EUR" ? "€" : "$"}{addonTotal.toFixed(2)}</span>
                </div>
              )}

              {overtimeMinutes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Overtime ({overtimeMinutes} min)
                  </span>
                  <span>{currency === "EUR" ? "€" : "$"}{overtimeCharge.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  {currency === "EUR" ? "€" : "$"}
                  {(totalFinal || totalEstimate).toFixed(2)}
                </span>
              </div>
              {totalFinal && totalFinal !== totalEstimate && (
                <p className="text-xs text-muted-foreground mt-1">
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
