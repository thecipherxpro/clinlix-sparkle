import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonCardProps {
  iconSrc: string;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const IconButtonCard: React.FC<IconButtonCardProps> = ({
  iconSrc,
  text,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center",
        "bg-muted/50 rounded-2xl",
        "w-full aspect-square",
        "min-h-[120px] max-h-[140px]",
        "p-4 sm:p-5",
        "transition-all duration-300 ease-in-out",
        "hover:bg-muted hover:shadow-lg hover:scale-[1.02]",
        "active:bg-muted/70 active:scale-[0.98]",
        "shadow-md",
        "cursor-pointer",
        className
      )}
    >
      <img 
        src={iconSrc} 
        alt={`${text} icon`}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain mb-2 sm:mb-3"
      />
      <span className="font-bold text-sm sm:text-base text-foreground text-center leading-tight">
        {text}
      </span>
    </button>
  );
};
