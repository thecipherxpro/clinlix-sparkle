import { useState, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: '.5rem',
    paddingRight: '.5rem',
  },
  animate: (selected: boolean) => ({
    gap: selected ? '.5rem' : 0,
    paddingLeft: selected ? '1rem' : '.5rem',
    paddingRight: selected ? '1rem' : '.5rem',
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: 'auto', opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { type: 'tween' as const, duration: 0.2 };

interface TabProps {
  text: string;
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}

const Tab = ({ text, selected, onSelect, children }: TabProps) => {
  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      custom={selected}
      onClick={onSelect}
      transition={transition}
      className={`relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 
      ${selected ? 'bg-black text-white' : 'text-gray-600 hover:text-black'} 
      focus:outline-none`}
    >
      {children}
      <AnimatePresence>
        {selected && (
          <motion.span
            variants={spanVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="overflow-hidden pl-1"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

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
    <nav className="sticky bottom-0 left-0 right-0 z-50 w-full bg-white border-t border-gray-200">
      <div className="flex items-center justify-around max-w-screen-xl mx-auto px-2 py-2">
        {tabs.map((tab) => (
          <Tab
            key={tab.title}
            text={tab.title}
            selected={selected === tab}
            onSelect={() => handleTabSelect(tab)}
          >
            {tab.icon}
          </Tab>
        ))}
      </div>
    </nav>
  );
};

export default CustomerTabNav;
