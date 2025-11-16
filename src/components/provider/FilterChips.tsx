import { CheckCircle, Star, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface FilterChipsProps {
  verifiedActive: boolean;
  onVerifiedToggle: () => void;
  minRating: number;
  onRatingToggle: () => void;
  hasLocationFilter: boolean;
  onLocationToggle: () => void;
  onResetAll: () => void;
}

export const FilterChips = ({
  verifiedActive,
  onVerifiedToggle,
  minRating,
  onRatingToggle,
  hasLocationFilter,
  onLocationToggle,
  onResetAll,
}: FilterChipsProps) => {
  const chips: FilterChip[] = [
    {
      id: "verified",
      label: "Verified",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      active: verifiedActive,
      onClick: onVerifiedToggle,
    },
    {
      id: "rating",
      label: minRating > 0 ? `${minRating}+ Stars` : "Top Rated",
      icon: <Star className="w-3.5 h-3.5" />,
      active: minRating > 0,
      onClick: onRatingToggle,
    },
    {
      id: "location",
      label: "Near Me",
      icon: <MapPin className="w-3.5 h-3.5" />,
      active: hasLocationFilter,
      onClick: onLocationToggle,
    },
  ];

  const activeFiltersCount = chips.filter(c => c.active).length;

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-3 px-4 snap-x snap-mandatory">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={chip.onClick}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            "min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 snap-start",
            "shadow-sm border-2",
            chip.active
              ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
              : "bg-background text-foreground border-border hover:bg-accent hover:border-accent-foreground/20"
          )}
          aria-pressed={chip.active}
          aria-label={chip.label}
        >
          {chip.icon}
          <span className="font-medium">{chip.label}</span>
        </button>
      ))}
      
      {activeFiltersCount > 0 && (
        <button
          onClick={onResetAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 snap-start bg-destructive/10 text-destructive hover:bg-destructive/20 border-2 border-destructive/20 shadow-sm"
          aria-label="Clear all filters"
        >
          <X className="w-4 h-4" />
          <span className="font-medium">Clear All</span>
        </button>
      )}
    </div>
  );
};
