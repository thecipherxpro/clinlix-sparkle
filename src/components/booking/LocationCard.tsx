import { useState } from "react";
import { MapPin, Navigation, ChevronDown, Home, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  address: {
    rua?: string;
    street?: string;
    porta_andar?: string | null;
    apt_unit?: string | null;
    localidade?: string;
    city?: string;
    codigo_postal?: string;
    postal_code?: string;
    distrito?: string | null;
    province?: string | null;
    property_type?: string;
    layout_type?: string;
    label?: string;
  };
  defaultExpanded?: boolean;
}

export const LocationCard = ({ address, defaultExpanded = false }: LocationCardProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const street = address.street || address.rua;
  const unit = address.apt_unit || address.porta_andar;
  const city = address.city || address.localidade;
  const postal = address.postal_code || address.codigo_postal;
  const province = address.province || address.distrito;

  const fullAddress = [
    street,
    unit,
    city,
    province,
    postal
  ].filter(Boolean).join(", ");

  const handleNavigate = () => {
    const encodedAddress = encodeURIComponent(fullAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Location
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Collapsed View */}
        {!expanded && (
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-foreground line-clamp-2">{address.label || street}</p>
          </div>
        )}

        {/* Expanded View */}
        {expanded && (
          <>
            {address.label && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
                {address.property_type === "apartment" ? (
                  <Building2 className="w-4 h-4 text-primary" />
                ) : (
                  <Home className="w-4 h-4 text-primary" />
                )}
                {address.label}
              </div>
            )}

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground font-medium">Address:</span>
                <span className="text-foreground">{street}</span>
              </div>
              
              {unit && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-muted-foreground font-medium">Unit:</span>
                  <span className="text-foreground">{unit}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground font-medium">City:</span>
                <span className="text-foreground">{city}</span>
              </div>

              {province && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-muted-foreground font-medium">Province:</span>
                  <span className="text-foreground">{province}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                <span className="text-muted-foreground font-medium">Postal Code:</span>
                <span className="text-foreground">{postal}</span>
              </div>

              {address.property_type && (
                <div>
                  <span className="text-muted-foreground">Property: </span>
                  <span className="text-foreground capitalize">{address.property_type}</span>
                  {address.layout_type && ` • ${address.layout_type}`}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigate}
              className="w-full mt-2 gap-2"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
