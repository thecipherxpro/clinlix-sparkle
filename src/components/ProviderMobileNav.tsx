import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, Calendar, DollarSign, User } from "lucide-react";
import { FloatingDock } from "./ui/floating-dock";

const ProviderMobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { 
      title: "Home",
      icon: <Home className={`h-full w-full transition-all duration-300 ${location.pathname === '/provider/dashboard' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/provider/dashboard",
      onClick: () => navigate("/provider/dashboard")
    },
    { 
      title: "Jobs",
      icon: <Briefcase className={`h-full w-full transition-all duration-300 ${location.pathname === '/provider/jobs' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/provider/jobs",
      onClick: () => navigate("/provider/jobs")
    },
    { 
      title: "Schedule",
      icon: <Calendar className={`h-full w-full transition-all duration-300 ${location.pathname === '/provider/schedule' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/provider/schedule",
      onClick: () => navigate("/provider/schedule")
    },
    { 
      title: "Wallet",
      icon: <DollarSign className={`h-full w-full transition-all duration-300 ${location.pathname === '/provider/wallet' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/provider/wallet",
      onClick: () => navigate("/provider/wallet")
    },
    { 
      title: "Profile",
      icon: <User className={`h-full w-full transition-all duration-300 ${location.pathname === '/provider/profile' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/provider/profile",
      onClick: () => navigate("/provider/profile")
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <FloatingDock items={dockItems} />
    </div>
  );
};

export default ProviderMobileNav;
