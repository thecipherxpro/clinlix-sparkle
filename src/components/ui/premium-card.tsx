import React from 'react';
import { cn } from '@/lib/utils';

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
  heroColor = '#fef4e2',
  onClick,
  className,
}) => {
  return (
    <article
      onClick={onClick}
      className={cn(
        "relative w-full aspect-[4/5] min-h-[280px] max-h-[360px]",
        "bg-card rounded-[32px] p-6 sm:p-8 md:p-10",
        "transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]",
        "flex flex-col items-center justify-between",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={{ backgroundColor: heroColor }}
    >
      {/* Large Icon/Illustration - Takes up top 50% */}
      <div className="w-full flex-1 flex items-center justify-center pt-2 sm:pt-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center text-foreground/90 drop-shadow-lg">
          {icon && <div className="scale-[3] sm:scale-[3.5] md:scale-[4]">{icon}</div>}
        </div>
      </div>

      {/* Content Section - Bottom 50% */}
      <div className="w-full flex flex-col items-center gap-3 sm:gap-4 pb-2">
        {/* Category Badge */}
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 sm:px-7 md:px-8 py-2 sm:py-2.5 shadow-sm">
          <span className="text-xs sm:text-sm md:text-base font-semibold text-foreground/90 whitespace-nowrap">
            {value || title}
          </span>
        </div>

        {/* Main Title */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground text-center leading-tight px-2 max-w-[90%]">
          {description}
        </h3>
      </div>

      {/* Arrow Navigation Button - Bottom Right */}
      <div className="absolute right-4 sm:right-5 md:right-6 bottom-4 sm:bottom-5 md:bottom-6 
                      w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 
                      bg-foreground rounded-full 
                      flex items-center justify-center 
                      shadow-lg hover:shadow-xl
                      hover:scale-110 active:scale-95
                      transition-all duration-200">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-background translate-x-[1px]"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </article>
  );
};
