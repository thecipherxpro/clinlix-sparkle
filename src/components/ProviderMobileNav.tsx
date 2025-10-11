import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, Calendar, DollarSign, User } from "lucide-react";
import FloatingIconBar from "./FloatingIconBar";

const ProviderMobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      id: "/provider/dashboard", 
      icon: Home, 
      label: "Home", 
      color: "from-blue-500 to-blue-600" 
    },
    { 
      id: "/provider/jobs", 
      icon: Briefcase, 
      label: "Jobs", 
      color: "from-purple-500 to-purple-600" 
    },
    { 
      id: "/provider/schedule", 
      icon: Calendar, 
      label: "Schedule", 
      color: "from-pink-500 to-pink-600",
      hideLabel: true
    },
    { 
      id: "/provider/wallet", 
      icon: DollarSign, 
      label: "Wallet", 
      color: "from-green-500 to-green-600" 
    },
    { 
      id: "/provider/profile", 
      icon: User, 
      label: "Profile", 
      color: "from-orange-500 to-orange-600" 
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

export default ProviderMobileNav;
