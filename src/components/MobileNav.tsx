import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MapPin, User } from "lucide-react";

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/customer/dashboard', icon: Home, label: 'Home' },
    { path: '/customer/booking', icon: Calendar, label: 'Book' },
    { path: '/customer/my-addresses', icon: MapPin, label: 'Addresses' },
    { path: '/customer/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50 md:hidden safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'fill-primary/20' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
