import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserX, Search, MapPin } from "lucide-react";

interface EmptyProvidersStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  searchQuery?: string;
}

export const EmptyProvidersState = ({
  hasFilters,
  onClearFilters,
  searchQuery,
}: EmptyProvidersStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 border-0 shadow-lg">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-6">
            <UserX className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No Providers Found</h3>
          {hasFilters ? (
            <p className="text-muted-foreground text-sm">
              No providers match your current filters. Try adjusting your search criteria.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              There are no service providers available at the moment.
            </p>
          )}
        </div>

        {/* Suggestions */}
        {searchQuery && (
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Try searching for:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-background px-3 py-1 rounded-full text-xs">Lisbon</span>
              <span className="bg-background px-3 py-1 rounded-full text-xs">Porto</span>
              <span className="bg-background px-3 py-1 rounded-full text-xs">Coimbra</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {hasFilters && (
            <Button
              onClick={onClearFilters}
              size="lg"
              className="w-full min-h-[48px]"
            >
              Clear All Filters
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            className="w-full min-h-[48px]"
            onClick={() => {
              // This would open a form or contact support
              window.location.href = "mailto:support@clinlix.com?subject=Service Request";
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Request Service in Your Area
          </Button>
        </div>
      </Card>
    </div>
  );
};
