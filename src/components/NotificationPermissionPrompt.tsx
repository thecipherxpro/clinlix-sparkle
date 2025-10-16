import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationPermissionPromptProps {
  onClose?: () => void;
}

export const NotificationPermissionPrompt = ({ onClose }: NotificationPermissionPromptProps) => {
  const [open, setOpen] = useState(false);
  const { permission, subscribe, isLoading } = usePushNotifications();

  useEffect(() => {
    // Show prompt only if permission hasn't been requested yet
    if (permission === 'default') {
      // Delay showing the prompt slightly so it doesn't appear immediately on login
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setOpen(false);
      onClose?.();
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  if (permission !== 'default') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-left">Stay Updated 🔔</DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-left pt-4">
            Clinlix would like to send you notifications about bookings, job requests, and important updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleEnable} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Enabling...' : 'Enable Notifications'}
          </Button>
          <Button 
            onClick={handleClose} 
            variant="outline" 
            className="w-full"
          >
            Not Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};