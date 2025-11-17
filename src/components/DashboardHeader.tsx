import { User, LogOut, ChevronDown } from 'lucide-react';
import { Avatar } from '@/components/base/avatar/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'customer' | 'provider';
}

export const DashboardHeader = ({
  firstName,
  lastName,
  avatarUrl,
  role,
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout');
    } else {
      navigate('/auth');
    }
  };

  const handleProfile = () => {
    navigate(`/${role}/profile`);
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-background to-background/0">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 relative">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1.5 rounded-full">
            <span className="text-base sm:text-lg font-bold text-primary-foreground tracking-wide">CLINILX</span>
          </div>
        </div>

        {/* Right Side - User Menu */}
        <div className="flex items-center gap-2">
          <Popover className="relative">
            <PopoverTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
              <Avatar
                src={avatarUrl}
                alt={`${firstName} ${lastName}`}
                fallback={`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()}
                size="md"
                className="ring-2 ring-border/50 rounded-full"
              />
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
            </PopoverTrigger>
            
            <PopoverContent className="w-56 p-2">
              <div className="px-3 py-2 border-b border-border mb-2">
                <p className="text-sm font-medium text-foreground">{firstName} {lastName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
              
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
