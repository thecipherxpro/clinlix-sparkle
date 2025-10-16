import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MapPin, User, Sparkles } from "lucide-react";
import { FloatingDock } from "./ui/floating-dock";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dockItems = [
    { 
      title: "Home",
      icon: <Home className={`h-full w-full transition-all duration-300 group-hover:scale-110 ${location.pathname === '/customer/dashboard' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/customer/dashboard",
      onClick: () => navigate("/customer/dashboard")
    },
    { 
      title: "Book Now",
      icon: <Calendar className={`h-full w-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${location.pathname === '/customer/booking' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/customer/booking",
      onClick: () => navigate("/customer/booking")
    },
    { 
      title: "My Bookings",
      icon: <Sparkles className={`h-full w-full transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-12deg] ${location.pathname === '/customer/my-bookings' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/customer/my-bookings",
      onClick: () => navigate("/customer/my-bookings")
    },
    { 
      title: "Addresses",
      icon: <MapPin className={`h-full w-full transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${location.pathname === '/customer/my-addresses' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
      href: "/customer/my-addresses",
      onClick: () => navigate("/customer/my-addresses")
    },
    { 
      title: "Profile",
      icon: <User className={`h-full w-full transition-all duration-300 group-hover:scale-110 ${location.pathname === '/customer/profile' ? 'text-primary' : 'text-neutral-500 dark:text-neutral-300'}`} />,
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
