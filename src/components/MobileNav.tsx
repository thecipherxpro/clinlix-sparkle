import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MapPin, User, Sparkles } from "lucide-react";
import { FloatingDock } from "./ui/floating-dock";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { 
      title: "Home",
      icon: (
        <div className="relative">
          <Home className="h-full w-full text-neutral-500 dark:text-neutral-300 transition-all duration-300 group-hover:scale-110" />
          {location.pathname === '/customer/dashboard' && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ),
      href: "/customer/dashboard",
      onClick: () => navigate("/customer/dashboard")
    },
    { 
      title: "Book Now",
      icon: (
        <div className="relative">
          <Calendar className="h-full w-full text-neutral-500 dark:text-neutral-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
          {location.pathname === '/customer/booking' && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ),
      href: "/customer/booking",
      onClick: () => navigate("/customer/booking")
    },
    { 
      title: "My Bookings",
      icon: (
        <div className="relative">
          <Sparkles className="h-full w-full text-neutral-500 dark:text-neutral-300 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-12deg]" />
          {location.pathname === '/customer/my-bookings' && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ),
      href: "/customer/my-bookings",
      onClick: () => navigate("/customer/my-bookings")
    },
    { 
      title: "Addresses",
      icon: (
        <div className="relative">
          <MapPin className="h-full w-full text-neutral-500 dark:text-neutral-300 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
          {location.pathname === '/customer/my-addresses' && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ),
      href: "/customer/my-addresses",
      onClick: () => navigate("/customer/my-addresses")
    },
    { 
      title: "Profile",
      icon: (
        <div className="relative">
          <User className="h-full w-full text-neutral-500 dark:text-neutral-300 transition-all duration-300 group-hover:scale-110" />
          {location.pathname === '/customer/profile' && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
          )}
        </div>
      ),
      href: "/customer/profile",
      onClick: () => navigate("/customer/profile")
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center animate-fade-in">
      <FloatingDock items={dockItems} />
    </div>
  );
};

export default MobileNav;
