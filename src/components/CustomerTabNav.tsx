import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Sparkles, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/contexts/I18nContext';

const CustomerTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  
  const tabs = [
    { title: 'Home', icon: <Home />, path: '/customer/dashboard' },
    { title: 'Book', icon: <Calendar />, path: '/customer/booking' },
    { title: 'Bookings', icon: <Sparkles />, path: '/customer/my-bookings' },
    { title: 'Account', icon: <User />, path: '/customer/account' },
  ];
  
  const [selectedPath, setSelectedPath] = useState(location.pathname);

  useEffect(() => {
    setSelectedPath(location.pathname);
  }, [location.pathname]);

  const handleTabSelect = (tab: typeof tabs[0]) => {
    setSelectedPath(tab.path);
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 pb-safe-bottom">
        {tabs.map((tab, index) => {
          const isSelected = selectedPath === tab.path;
          return (
            <motion.button
              key={tab.title}
              onClick={() => handleTabSelect(tab)}
              className="relative flex flex-col items-center justify-center gap-1
                         min-w-[68px] py-2 px-3 rounded-lg touch-target"
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {isSelected && (
                <motion.div
                  layoutId="tabBackground"
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              
              <motion.div
                animate={{
                  scale: isSelected ? 1 : 0.95,
                  color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative z-10 flex items-center justify-center w-6 h-6"
              >
                {tab.icon}
              </motion.div>
              
              <motion.span
                animate={{
                  opacity: isSelected ? 1 : 0.7,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative z-10 text-[11px] leading-tight"
              >
                {tab.title}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default CustomerTabNav;
