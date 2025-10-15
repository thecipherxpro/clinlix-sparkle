import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  title: string;
  description: string;
  badge?: string;
  value?: string | React.ReactNode;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  title,
  description,
  badge,
  value,
  icon,
  accentColor = '#7c3aed',
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full h-[254px] bg-card rounded-[20px] overflow-hidden",
        "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] border border-border/20",
        "hover:translate-y-[-10px] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
        "hover:border-primary/20 active:translate-y-[-5px] active:scale-[0.98]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_3s_infinite] transition-opacity duration-300" 
           style={{ 
             backgroundSize: '200% 100%',
             backgroundPosition: '-100% 0'
           }} 
      />
      
      {/* Glow Effect */}
      <div className="absolute inset-[-10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
           style={{
             background: `radial-gradient(circle at 50% 0%, ${accentColor}4D 0%, transparent 70%)`
           }}
      />

      {/* Content */}
      <div className="relative z-[2] p-5 h-full flex flex-col gap-3">
        {/* Badge */}
        {badge && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-[0.7em] font-semibold scale-[0.8] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-400 delay-100">
            {badge}
          </div>
        )}

        {/* Image/Icon Section */}
        <div className="w-full h-[100px] rounded-xl relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-[-5px] group-hover:scale-[1.03] group-hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]"
             style={{ background: `linear-gradient(45deg, ${accentColor}CC, ${accentColor})` }}>
          <div className="absolute inset-0 opacity-50"
               style={{
                 background: `
                   radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
                   repeating-linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0px, rgba(139, 92, 246, 0.1) 2px, transparent 2px, transparent 4px)
                 `
               }}
          />
          {/* Icon or Value Display */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {icon ? (
              <div className="w-12 h-12">{icon}</div>
            ) : (
              <div className="text-4xl font-bold">{value}</div>
            )}
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1">
          <p className="text-foreground text-[1.1em] font-bold m-0 transition-all duration-300 group-hover:text-primary group-hover:translate-x-[2px]">
            {title}
          </p>
          <p className="text-foreground text-[0.75em] m-0 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-[2px]">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto">
          <div className="text-foreground font-bold text-[1em] transition-all duration-300 group-hover:text-primary group-hover:translate-x-[2px]">
            {typeof value === 'string' ? value : ''}
          </div>
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-primary-foreground cursor-pointer transition-all duration-300 scale-[0.9] group-hover:scale-100 group-hover:shadow-[0_0_0_4px_rgba(124,58,237,0.2)]">
            <svg height={16} width={16} viewBox="0 0 24 24" className="group-hover:animate-[pulse_1.5s_infinite]">
              <path strokeWidth={2} stroke="currentColor" d="M4 12H20M12 4V20" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
