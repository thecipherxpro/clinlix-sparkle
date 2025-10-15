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
        "w-full bg-card rounded-xl p-1.5 text-foreground",
        "transition-all duration-300 hover:shadow-lg",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Hero Section */}
      <section 
        className="rounded-lg rounded-b-none p-3 sm:p-4 text-xs"
        style={{ backgroundColor: heroColor }}
      >
        <header className="flex justify-between items-center flex-row gap-2 font-bold">
          <span className="text-[10px] sm:text-xs">{value || '$150/hr'}</span>
          <div className="card__icon">
            <svg 
              height={14} 
              width={14} 
              stroke="currentColor" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <path 
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </header>
        <p className="my-3 sm:my-4 text-base sm:text-lg md:text-xl font-semibold pr-2 sm:pr-4 leading-tight">
          {title}
        </p>
      </section>

      {/* Footer */}
      <footer className="flex justify-center items-center p-2 sm:p-2.5">
        <button className="w-full font-normal border-none cursor-pointer text-center py-1.5 px-3 sm:px-4 rounded-lg bg-foreground text-background text-[10px] sm:text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {icon}
          <span>view</span>
        </button>
      </footer>
    </article>
  );
};
