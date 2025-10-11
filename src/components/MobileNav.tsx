import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MapPin, User } from "lucide-react";
import FloatingIconBar from "./FloatingIconBar";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: '/customer/dashboard', 
      icon: Home, 
      label: 'Home', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      id: '/customer/booking', 
      icon: Calendar, 
      label: 'Book', 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      id: '/customer/my-addresses', 
      icon: MapPin, 
      label: 'Addresses', 
      color: 'from-pink-500 to-pink-600' 
    },
    { 
      id: '/customer/profile', 
      icon: User, 
      label: 'Profile', 
      color: 'from-orange-500 to-orange-600' 
    },
  ];

  const handleTabChange = (tabId: string) => {
    navigate(tabId);
  };

  return (
    <FloatingIconBar
      items={navItems}
      activeTab={location.pathname}
      onTabChange={handleTabChange}
      position="bottom"
      showLabels={true}
      showSeparators={true}
    />
  );
};

export default MobileNav;
