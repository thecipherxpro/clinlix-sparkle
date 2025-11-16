import { useState, useEffect } from 'react';
import { Home, ClipboardCheck, Search, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

interface TabItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const CustomerTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  
  const tabs: TabItem[] = [
    { title: t.dashboard.welcome, icon: <Home className="w-5 h-5" />, path: '/customer/dashboard' },
    { title: t.dashboard.myBookings, icon: <ClipboardCheck className="w-5 h-5" />, path: '/customer/my-bookings' },
    { title: 'Browse', icon: <Search className="w-5 h-5" />, path: '/customer/providers' },
    { title: t.common.profile, icon: <User className="w-5 h-5" />, path: '/customer/profile' },
  ];
  
  const [selected, setSelected] = useState(tabs[0]);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setSelected(currentTab);
    }
  }, [location.pathname, t]);

  const handleTabSelect = (tab: TabItem) => {
    setSelected(tab);
    navigate(tab.path);
  };

  const isSelected = (tab: TabItem) => selected.path === tab.path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-background border-t border-border shadow-lg">
      <div className="flex items-center justify-around max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleTabSelect(tab)}
            className={`
              relative flex flex-col items-center justify-center gap-1
              min-h-[56px] min-w-[20%] px-3 py-2
              transition-all duration-200
              ${isSelected(tab) 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {/* Top border indicator for active tab */}
            <div 
              className={`
                absolute top-0 left-0 right-0 h-[3px] rounded-b-full
                transition-all duration-200
                ${isSelected(tab) ? 'bg-primary' : 'bg-transparent'}
              `}
            />
            
            {/* Icon with badge */}
            <div className="relative">
              {tab.icon}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </div>
            
            {/* Always visible label */}
            <span className={`
              text-[11px] font-medium leading-tight text-center
              ${isSelected(tab) ? 'font-semibold' : ''}
            `}>
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CustomerTabNav;
