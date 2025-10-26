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
        "w-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {/* Image Section - Responsive padding and sizing */}
      <div className="flex justify-center items-center py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 bg-white">
        {illustration ? (
          <img 
            src={illustration} 
            alt={title}
            className="w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] object-contain -mb-2 sm:-mb-3 md:-mb-4"
          />
        ) : icon ? (
          <div className="w-full max-w-[120px] sm:max-w-[160px] md:max-w-[200px] flex items-center justify-center -mb-2 sm:-mb-3 md:-mb-4">
            <div className="scale-[2] sm:scale-[2.5] md:scale-[3]">{icon}</div>
          </div>
        ) : null}
      </div>

      {/* Content Section - Responsive padding */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
          <span className="py-1.5 px-3 sm:py-2 sm:px-4 md:px-5 bg-fuchsia-50 text-fuchsia-700 rounded-full font-semibold text-xs sm:text-sm">
            {value || title}
          </span>
        </div>
        
        <div className="flex justify-between items-end gap-2">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-black leading-tight">
            {description}
          </h2>
          <button 
            className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
            aria-label={`Navigate to ${title}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={3} 
              stroke="currentColor" 
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M8.25 4.5l7.5 7.5-7.5 7.5" 
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};
