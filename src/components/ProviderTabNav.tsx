import { useEffect, useState } from 'react';
import { Home, Briefcase, Calendar, DollarSign, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Home', icon: <Home />, path: '/provider/dashboard' },
  { title: 'Jobs', icon: <Briefcase />, path: '/provider/jobs' },
  { title: 'Schedule', icon: <Calendar />, path: '/provider/schedule' },
  { title: 'Wallet', icon: <DollarSign />, path: '/provider/wallet' },
  { title: 'Profile', icon: <User />, path: '/provider/profile' },
];

interface TabProps {
  text: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
}

const Tab = ({ text, selected, onSelect, icon }: TabProps) => {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-col items-center justify-center flex-1 min-w-0 py-2 px-1 transition-colors ${
        selected
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs mt-1 truncate w-full text-center">{text}</span>
    </button>
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
    <nav className="sticky bottom-0 left-0 right-0 z-50 w-full bg-background/95 backdrop-blur-sm border-t border-border safe-bottom">
      <div className="flex items-stretch max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <Tab
            key={tab.title}
            text={tab.title}
            icon={tab.icon}
            selected={selected === tab}
            onSelect={() => handleTabSelect(tab)}
          />
        ))}
      </div>
    </nav>
  );
};

export default ProviderTabNav;
