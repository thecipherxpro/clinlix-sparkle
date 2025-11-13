import { Bell } from 'lucide-react';
import { Avatar } from '@/components/base/avatar/avatar';

interface DashboardHeaderProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export const DashboardHeader = ({
  firstName,
  lastName,
  avatarUrl,
  notificationCount = 0,
  onNotificationClick,
}: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-background to-background/0">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 rounded-full">
            <span className="text-base sm:text-lg font-bold text-primary-foreground tracking-wide">CLINILX</span>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-full bg-background/80 hover:bg-background transition-colors border border-border/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
            {notificationCount > 0 && (
              <div className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full ring-2 ring-background" />
            )}
          </button>

          {/* User Avatar */}
          <Avatar
            src={avatarUrl}
            alt={`${firstName} ${lastName}`}
            fallback={`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
            size="md"
            className="rounded-full ring-2 ring-border/50"
          />
        </div>
      </div>
    </header>
  );
};
