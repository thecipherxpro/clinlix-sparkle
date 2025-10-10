import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateScrollerProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  datesWithSlots: Set<string>;
}

export function DateScroller({ selectedDate, onSelectDate, datesWithSlots }: DateScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Scroll to selected date on mount
    if (scrollRef.current) {
      const selectedIndex = dates.findIndex(
        d => d.toDateString() === selectedDate.toDateString()
      );
      if (selectedIndex > 0) {
        scrollRef.current.scrollTo({
          left: selectedIndex * 80,
          behavior: 'smooth'
        });
      }
    }
  }, []);

  const formatDay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const dateKey = (date: Date) => date.toISOString().split('T')[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-sm"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-10 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {dates.map((date) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const hasSlots = datesWithSlots.has(dateKey(date));

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex flex-col items-center min-w-[70px] p-3 rounded-lg transition-all",
                "border hover:border-primary/50",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent"
              )}
            >
              <span className="text-xs font-medium mb-1">
                {formatDay(date)}
              </span>
              <span className={cn(
                "text-lg font-bold",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {date.getDate()}
              </span>
              <span className="text-xs opacity-70">
                {formatDate(date).split(' ')[0]}
              </span>
              {hasSlots && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1",
                  isSelected ? "bg-primary-foreground" : "bg-primary"
                )} />
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-sm"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
