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
        "bg-[#f0f0f0]",
        "border-none rounded-[15px]",
        "w-[120px] h-[120px]",
        "px-5 py-2.5",
        "cursor-pointer",
        "transition-all duration-300 ease-in-out",
        "shadow-[0_4px_6px_rgba(0,0,0,0.1)]",
        "hover:bg-[#e0e0e0] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)]",
        "active:bg-[#d0d0d0] active:shadow-none",
        className
      )}
    >
      <img 
        src={iconSrc} 
        alt={`${text} icon`}
        className="w-[60px] h-[60px] object-contain mb-2"
      />
      <span className="font-bold text-base text-black text-center leading-tight">
        {text}
      </span>
    </button>
  );
};
