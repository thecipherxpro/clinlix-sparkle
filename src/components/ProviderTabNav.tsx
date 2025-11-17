import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, Calendar, MessageSquare, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Home', icon: <Home />, path: '/provider/dashboard' },
  { title: 'Jobs', icon: <Briefcase />, path: '/provider/jobs' },
  { title: 'Schedule', icon: <Calendar />, path: '/provider/schedule' },
  { title: 'Messages', icon: <MessageSquare />, path: '/provider/messages' },
  { title: 'Profile', icon: <User />, path: '/provider/profile' },
];

const ProviderTabNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(tabs[0]);

  useEffect(() => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    if (currentTab) {
      setSelected(currentTab);
    }
  }, [location.pathname]);

  const handleTabSelect = (tab: typeof tabs[0]) => {
    setSelected(tab);
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe-bottom pointer-events-none">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-3 mb-3 pointer-events-auto"
      >
        <div className="flex items-center justify-around px-2 py-1.5 rounded-2xl 
                        bg-background/95 backdrop-blur-2xl border border-border/60 
                        shadow-xl shadow-primary/5">
          {tabs.map((tab, index) => {
            const isSelected = selected === tab;
            return (
              <motion.button
                key={tab.title}
                onClick={() => handleTabSelect(tab)}
                className="relative flex flex-col items-center justify-center gap-0.5
                           min-w-[64px] py-2 px-3 rounded-xl touch-target group"
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="providerTabBackground"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                    scale: isSelected ? 1 : 0.9,
                    color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative z-10 text-[10px] font-medium leading-tight"
                >
                  {tab.title}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default ProviderTabNav;
