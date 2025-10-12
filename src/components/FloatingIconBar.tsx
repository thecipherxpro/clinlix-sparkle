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
    ? 'top-[clamp(16px,4vw,24px)]' 
    : 'bottom-[clamp(16px,4vw,24px)]';

  return (
    /* Mobile-first floating nav bar with auto-fit width and responsive positioning */
    <div className={`fixed ${positionClasses} left-1/2 transform -translate-x-1/2 z-50 
                    w-[min(95%,600px)] px-[clamp(8px,2vw,16px)] ${className}`}>
      <div className="bg-white rounded-full shadow-2xl 
                     px-[clamp(8px,2vw,24px)] py-[clamp(8px,2vw,16px)] 
                     flex items-center justify-center gap-[clamp(4px,1vw,8px)] 
                     border border-gray-200 backdrop-blur-lg bg-opacity-95">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? `w-[clamp(80px,20vw,128px)] bg-gradient-to-r ${item.color} rounded-full 
                       px-[clamp(8px,2vw,16px)] py-[clamp(8px,2vw,12px)] shadow-lg` 
                    : 'w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] hover:bg-gray-100 rounded-full'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon 
                  className={`flex-shrink-0 transition-all duration-300 ${
                    isActive 
                      ? 'w-[clamp(20px,5vw,28px)] h-[clamp(20px,5vw,28px)] text-white' 
                      : 'w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-gray-400'
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {isActive && showLabels && !item.hideLabel && (
                  <span className="ml-[clamp(6px,1.5vw,10px)] text-white font-semibold 
                                 text-[clamp(11px,2.8vw,14px)] whitespace-nowrap">
                    {item.label}
                  </span>
                )}

                {isActive && (
                  <div className="absolute -top-[clamp(2px,0.5vw,4px)] -right-[clamp(2px,0.5vw,4px)] 
                                w-[clamp(8px,2vw,12px)] h-[clamp(8px,2vw,12px)] 
                                bg-white rounded-full shadow-md animate-pulse" />
                )}

                {item.badge && (
                  <span className="absolute -top-[clamp(2px,0.5vw,4px)] -right-[clamp(2px,0.5vw,4px)] 
                                 min-w-[clamp(18px,4.5vw,20px)] h-[clamp(16px,4vw,20px)] 
                                 bg-red-500 text-white text-[clamp(10px,2.5vw,12px)] font-bold 
                                 rounded-full flex items-center justify-center 
                                 px-[clamp(4px,1vw,6px)]">
                    {item.badge}
                  </span>
                )}
              </button>
              
              {showSeparators && index < items.length - 1 && !isActive && (
                <div className="w-px h-[clamp(24px,6vw,32px)] bg-gray-200" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingIconBar;
