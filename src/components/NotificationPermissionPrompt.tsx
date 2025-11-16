import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPermissionPromptProps {
  onClose?: () => void;
}

export const NotificationPermissionPrompt = ({ onClose }: NotificationPermissionPromptProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { permission, subscribe, isLoading } = usePushNotifications();

  useEffect(() => {
    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('notification-prompt-dismissed');
    
    // Show banner only if permission hasn't been requested and wasn't dismissed
    if (permission === 'default' && !wasDismissed) {
      // Delay showing the banner so it doesn't appear immediately on login
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setVisible(false);
      onClose?.();
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('notification-prompt-dismissed', 'true');
    onClose?.();
  };

  const handleLater = () => {
    setVisible(false);
    // Don't set permanent dismissal, will show again next session
  };

  if (permission !== 'default' || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
        >
          <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-sm">Stay in the loop</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleDismiss}
                      className="h-6 w-6 -mt-1 -mr-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get instant updates about your bookings and job requests
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleEnable} 
                      size="sm"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enabling...' : 'Enable'}
                    </Button>
                    <Button 
                      onClick={handleLater} 
                      variant="ghost" 
                      size="sm"
                      className="flex-1"
                    >
                      Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};