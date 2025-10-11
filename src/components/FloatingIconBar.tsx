import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  badge?: number | string;
  hideLabel?: boolean;
}

interface FloatingIconBarProps {
  items: NavigationItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  position?: 'bottom' | 'top';
  showLabels?: boolean;
  showSeparators?: boolean;
  className?: string;
}

const FloatingIconBar: React.FC<FloatingIconBarProps> = ({ 
  items = [], 
  activeTab, 
  onTabChange,
  position = 'bottom',
  showLabels = true,
  showSeparators = true,
  className = ''
}) => {
  const positionClasses = position === 'top' 
    ? 'top-6' 
    : 'bottom-6';

  return (
    <div className={`fixed ${positionClasses} left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-2xl px-2 sm:px-4 ${className}`}>
      <div className="bg-white rounded-full shadow-2xl px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 flex items-center justify-center gap-1 sm:gap-2 border border-gray-200 backdrop-blur-lg bg-opacity-95">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `w-20 sm:w-24 md:w-32 bg-gradient-to-r ${item.color} rounded-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 shadow-lg` 
                    : 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 hover:bg-gray-100 rounded-full'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  className={`flex-shrink-0 transition-all duration-300 ${
                    isActive 
                      ? 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white' 
                      : 'w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {isActive && showLabels && !item.hideLabel && (
                  <span className="ml-1.5 sm:ml-2 md:ml-2.5 text-white font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {isActive && (
                  <div className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full shadow-md animate-pulse" />
                )}

                {item.badge && (
                  <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-1 sm:px-1.5">
                    {item.badge}
                  </span>
                )}
              </button>
              
              {showSeparators && index < items.length - 1 && !isActive && (
                <div className="w-px h-6 sm:h-7 md:h-8 bg-gray-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingIconBar;
