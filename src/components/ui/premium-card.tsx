import React from "react";
import { cn } from "@/lib/utils";
interface JobCardProps {
  title: string;
  description: string;
  value?: string;
  icon?: React.ReactNode;
  heroColor?: string;
  onClick?: () => void;
  className?: string;
}
export const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  value,
  icon,
  heroColor = "#fef4e2",
  onClick,
  className,
}) => {
  return (
    <article
      onClick={onClick}
      className={cn(
        "relative w-full bg-card rounded-2xl p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]",
        "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        "flex flex-col justify-between",
        onClick && "cursor-pointer active:scale-[0.98]",
        className,
      )}
      style={{
        backgroundColor: heroColor,
      }}
    >
      {/* Icon */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-foreground/70">
        {icon && <div className="scale-[2] sm:scale-[2.5]">{icon}</div>}
      </div>

      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-center my-2">
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-0.5 line-clamp-1">{title}</h3>
        <p className="text-xs sm:text-sm text-foreground/60 line-clamp-1">{description}</p>
      </div>

      {/* Arrow Button */}
      <div className="absolute right-3 bottom-3 w-5 h-5 sm:w-5 sm:h-5 bg-foreground rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform touch-target">
        <svg
          width="7"
          height="7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-background translate-x-0.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </article>
  );
};
