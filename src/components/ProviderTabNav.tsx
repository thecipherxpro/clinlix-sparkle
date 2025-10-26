import { useState, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Briefcase, Calendar, DollarSign, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Home', icon: <Home />, path: '/provider/dashboard' },
  { title: 'Jobs', icon: <Briefcase />, path: '/provider/jobs' },
  { title: 'Schedule', icon: <Calendar />, path: '/provider/schedule' },
  { title: 'Wallet', icon: <DollarSign />, path: '/provider/wallet' },
  { title: 'Profile', icon: <User />, path: '/provider/profile' },
];

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

const transition = { delay: 0.1, type: 'spring' as const, bounce: 0, duration: 0.35 };

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
      className={`${
        selected
          ? 'bg-primary/15 text-primary'
          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
      } relative flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 focus-within:outline-primary/50`}
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
            className="overflow-hidden"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

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
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-background/95 backdrop-blur-lg shadow-lg px-4 py-3">
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
    </div>
  );
};

export default ProviderTabNav;
