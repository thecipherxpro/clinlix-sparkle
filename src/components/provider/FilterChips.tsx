import { CheckCircle, Star, MapPin, DollarSign, Sparkles } from "lucide-react";
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
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 px-4">
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={chip.onClick}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all min-h-[44px]",
            "active:scale-95 touch-manipulation",
            chip.active
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {chip.icon}
          {chip.label}
        </button>
      ))}
      
      {activeFiltersCount > 0 && (
        <button
          onClick={onResetAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all min-h-[44px] active:scale-95 touch-manipulation"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
