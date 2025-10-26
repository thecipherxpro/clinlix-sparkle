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
  illustration?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  description,
  value,
  icon,
  heroColor = '#fef4e2',
  onClick,
  className,
  illustration,
}) => {
  return (
    <article
      onClick={onClick}
      className={cn(
        "relative w-full aspect-[1/1.15] sm:aspect-[1/1.2]",
        "min-h-[180px] max-h-[240px] sm:max-h-[260px]",
        "bg-card rounded-[20px] sm:rounded-[24px]",
        "p-3 sm:p-4",
        "shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
        "transition-all duration-300",
        "hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:scale-[1.02]",
        "flex flex-col items-center justify-between",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={{ backgroundColor: heroColor }}
    >
      {/* Compact Illustration */}
      <div className="w-full flex-1 flex items-center justify-center pt-2 sm:pt-3">
        {illustration ? (
          <img 
            src={illustration} 
            alt={title}
            className="w-full h-full max-w-[55%] sm:max-w-[60%] max-h-full object-contain drop-shadow-sm"
          />
        ) : icon ? (
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-foreground/90 drop-shadow-md">
            <div className="scale-[2.5] sm:scale-[3]">{icon}</div>
          </div>
        ) : null}
      </div>

      {/* Compact Content Section */}
      <div className="w-full flex flex-col items-center gap-1.5 sm:gap-2 pb-1.5 sm:pb-2">
        {/* Smaller Badge */}
        <div className="bg-white/85 backdrop-blur-sm rounded-full px-3 sm:px-5 py-1 sm:py-1.5 shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold text-foreground/95 whitespace-nowrap">
            {value || title}
          </span>
        </div>

        {/* Compact Title */}
        <h3 className="text-xs sm:text-sm font-bold text-foreground text-center leading-tight px-2 max-w-[95%] line-clamp-2">
          {description}
        </h3>
      </div>

      {/* Smaller Arrow Button */}
      <button 
        className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3
                   w-8 h-8 sm:w-10 sm:h-10
                   bg-foreground rounded-full 
                   flex items-center justify-center 
                   shadow-md hover:shadow-lg
                   hover:scale-110 active:scale-95
                   transition-all duration-200"
        aria-label={`Navigate to ${title}`}
      >
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-background translate-x-[0.5px] sm:w-4 sm:h-4"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </article>
  );
};
