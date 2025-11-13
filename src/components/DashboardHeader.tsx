import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  firstName: string;
  lastName: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export const DashboardHeader = ({
  firstName,
  lastName,
  notificationCount = 0,
  onNotificationClick,
}: DashboardHeaderProps) => {
  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-background to-background/0">
      <div className="flex h-14 items-center justify-between px-3 sm:px-4">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 rounded-full">
            <span className="text-base sm:text-lg font-bold text-primary-foreground tracking-wide">CLINILX</span>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors border border-border/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 sm:h-5 sm:w-5 text-foreground" strokeWidth={2} />
            {notificationCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-destructive rounded-full" />
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-background/80 text-foreground font-bold text-sm sm:text-base border border-border/50">
            {getInitials()}
          </div>
        </div>
      </div>
    </header>
  );
};
