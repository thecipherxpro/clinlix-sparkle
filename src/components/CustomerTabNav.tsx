import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Sparkles, MapPin, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

const CustomerTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  
  const tabs = [
    { title: t.dashboard.welcome, icon: <Home />, path: '/customer/dashboard' },
    { title: t.dashboard.bookCleaning, icon: <Calendar />, path: '/customer/booking' },
    { title: t.dashboard.myBookings, icon: <Sparkles />, path: '/customer/my-bookings' },
    { title: t.dashboard.myAddresses, icon: <MapPin />, path: '/customer/my-addresses' },
    { title: t.common.profile, icon: <User />, path: '/customer/profile' },
  ];
  
  const [selected, setSelected] = useState(tabs[0]);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setSelected(currentTab);
    }
  }, [location.pathname, t]);

  const handleTabSelect = (tab: typeof tabs[0]) => {
    setSelected(tab);
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-3 px-4 pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="max-w-md mx-auto pointer-events-auto"
      >
        <div className="flex items-center justify-around gap-1 px-3 py-2.5 rounded-full 
                        bg-background/80 backdrop-blur-xl border border-border/50 shadow-lg">
          {tabs.map((tab) => {
            const isSelected = selected === tab;
            return (
              <motion.button
                key={tab.title}
                onClick={() => handleTabSelect(tab)}
                className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[56px] 
                           rounded-full transition-colors touch-target"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                    color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  {tab.icon}
                  {isSelected && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default CustomerTabNav;
