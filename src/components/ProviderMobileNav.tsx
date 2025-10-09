import { NavLink } from "react-router-dom";
import { Home, Briefcase, Calendar, DollarSign, User } from "lucide-react";

const ProviderMobileNav = () => {
  const navItems = [
    { to: "/provider/dashboard", icon: Home, label: "Home" },
    { to: "/provider/jobs", icon: Briefcase, label: "Jobs" },
    { to: "/provider/schedule", icon: Calendar, label: "Schedule" },
    { to: "/provider/wallet", icon: DollarSign, label: "Wallet" },
    { to: "/provider/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default ProviderMobileNav;
