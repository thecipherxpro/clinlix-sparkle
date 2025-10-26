import { useEffect, useState } from 'react';
import { Home, Calendar, Sparkles, MapPin, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { title: 'Home', icon: <Home />, path: '/customer/dashboard' },
  { title: 'Book', icon: <Calendar />, path: '/customer/booking' },
  { title: 'Bookings', icon: <Sparkles />, path: '/customer/my-bookings' },
  { title: 'Addresses', icon: <MapPin />, path: '/customer/my-addresses' },
  { title: 'Profile', icon: <User />, path: '/customer/profile' },
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

const CustomerTabNav = () => {
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

export default CustomerTabNav;
