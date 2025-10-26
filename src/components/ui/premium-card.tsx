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
        "relative w-full aspect-[3/4] sm:aspect-[4/5]",
        "min-h-[300px] sm:min-h-[320px] md:min-h-[340px]",
        "bg-card rounded-[28px] sm:rounded-[32px]",
        "p-4 sm:p-6 md:p-8",
        "shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
        "transition-all duration-300",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-[1.02]",
        "flex flex-col items-center justify-between",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
      style={{ backgroundColor: heroColor }}
    >
      {/* Large Illustration - Takes up ~55% of height */}
      <div className="w-full flex-[1.2] flex items-center justify-center pt-4 sm:pt-6">
        {illustration ? (
          <img 
            src={illustration} 
            alt={title}
            className="w-full h-full max-w-[70%] max-h-full object-contain drop-shadow-md"
          />
        ) : icon ? (
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center text-foreground/90 drop-shadow-lg">
            <div className="scale-[3.5] sm:scale-[4] md:scale-[4.5]">{icon}</div>
          </div>
        ) : null}
      </div>

      {/* Content Section - Bottom ~45% */}
      <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3 md:gap-4 pb-2 sm:pb-3">
        {/* Category Badge */}
        <div className="bg-white/85 backdrop-blur-sm rounded-full px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 shadow-sm">
          <span className="text-xs sm:text-sm md:text-base font-semibold text-foreground/95 whitespace-nowrap">
            {value || title}
          </span>
        </div>

        {/* Main Title */}
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground text-center leading-tight px-3 sm:px-4 max-w-[95%]">
          {description}
        </h3>
      </div>

      {/* Arrow Navigation Button - Bottom Right */}
      <button 
        className="absolute right-3 sm:right-4 md:right-5 bottom-3 sm:bottom-4 md:bottom-5
                   w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                   bg-foreground rounded-full 
                   flex items-center justify-center 
                   shadow-lg hover:shadow-xl
                   hover:scale-110 active:scale-95
                   transition-all duration-200"
        aria-label={`Navigate to ${title}`}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-background translate-x-[1px] sm:w-5 sm:h-5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </article>
  );
};
