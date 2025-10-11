import React from 'react';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  badge?: number | string;
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
    <div className={`fixed ${positionClasses} left-1/2 transform -translate-x-1/2 z-50 ${className}`}>
      <div className="bg-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-2 border border-gray-200 backdrop-blur-lg bg-opacity-95">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `w-32 bg-gradient-to-r ${item.color} rounded-full px-4 py-3 shadow-lg` 
                    : 'w-12 h-12 hover:bg-gray-100 rounded-full'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'w-5 h-5 text-white' 
                      : 'w-6 h-6 text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {isActive && showLabels && (
                  <span className="ml-2 text-white font-semibold text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-md animate-pulse" />
                )}

                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                    {item.badge}
                  </span>
                )}
              </button>
              
              {showSeparators && index < items.length - 1 && !isActive && (
                <div className="w-px h-8 bg-gray-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingIconBar;
