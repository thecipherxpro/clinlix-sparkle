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
        "relative w-full bg-card rounded-3xl p-6 sm:p-8",
        "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]",
        "flex flex-col items-center",
        onClick && "cursor-pointer",
        className
      )}
      style={{ backgroundColor: heroColor }}
    >
      {/* Icon/Illustration */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mb-4 flex items-center justify-center text-foreground/80">
        {icon && <div className="scale-[2.5] sm:scale-[3]">{icon}</div>}
      </div>

      {/* Category Badge */}
      <div className="bg-white/70 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
        <span className="text-sm sm:text-base font-medium text-foreground/90">
          {value || title}
        </span>
      </div>

      {/* Main Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 text-center">
        {description}
      </h3>

      {/* Arrow Navigation Button */}
      <div className="absolute right-4 bottom-4 w-12 h-12 sm:w-14 sm:h-14 bg-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
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
