import React from "react";
import { cn } from "@/lib/utils";
interface JobCardProps {
  title: string;
  description: string;
  value?: string;
  icon?: React.ReactNode;
  image?: string;
  heroColor?: string;
  onClick?: () => void;
  className?: string;
}
export const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  value,
  icon,
  image,
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
      {/* Icon or Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-foreground/70">
        {image ? (
          <img src={image} alt={title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
        ) : icon ? (
          <div className="scale-[2] sm:scale-[2.5]">{icon}</div>
        ) : null}
      </div>

      {/* Text Content */}
      <div className="flex-1 flex flex-col justify-center my-2">
        <h3 className="text-base sm:text-lg font-bold text-foreground mb-0.5 line-clamp-1">{title}</h3>
        <p className="text-xs sm:text-sm text-foreground/60 line-clamp-1">{description}</p>
      </div>

      {/* Arrow Button */}
      <div className="absolute right-2 bottom-2 w-8 h-8 sm:w-8 sm:h-8 bg-foreground rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-background translate-x-px"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </article>
  );
};
