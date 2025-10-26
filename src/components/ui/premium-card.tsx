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
        "w-full max-w-xs bg-white rounded-2xl shadow-lg overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      {/* Image Section */}
      <div className="flex justify-center items-center py-8 px-6 bg-white">
        {illustration ? (
          <img 
            src={illustration} 
            alt={title}
            className="w-full max-w-[200px] object-contain -mb-4"
          />
        ) : icon ? (
          <div className="w-full max-w-[200px] flex items-center justify-center -mb-4">
            <div className="scale-[3]">{icon}</div>
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex justify-center mb-5">
          <span className="py-2 px-5 bg-fuchsia-50 text-fuchsia-700 rounded-full font-semibold text-sm">
            {value || title}
          </span>
        </div>
        
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-bold text-black leading-tight">
            {description}
          </h2>
          <button 
            className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
            aria-label={`Navigate to ${title}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={3} 
              stroke="currentColor" 
              className="w-5 h-5"
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
