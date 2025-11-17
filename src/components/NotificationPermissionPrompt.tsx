import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, X, MessageSquare, Calendar, CreditCard } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserRole } from '@/lib/roleUtils';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPermissionPromptProps {
  onClose?: () => void;
  role?: 'customer' | 'provider';
}

export const NotificationPermissionPrompt = ({ onClose, role: propRole }: NotificationPermissionPromptProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [role, setRole] = useState<'customer' | 'provider' | null>(propRole || null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const { permission, subscribe, isLoading } = usePushNotifications();

  useEffect(() => {
    const loadRole = async () => {
      if (!propRole) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userRole = await getUserRole(user.id);
          setRole(userRole);
        }
      }
    };
    loadRole();
  }, [propRole]);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('notification-prompt-dismissed');
    
    if (permission === 'default' && !wasDismissed) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [permission]);

  const handleEnable = async () => {
    // Haptic feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    
    const success = await subscribe();
    if (success) {
      setVisible(false);
      onClose?.();
    }
  };

  const handleDismiss = () => {
    // Haptic feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate([30, 20, 30]);
    }
    
    setVisible(false);
    setDismissed(true);
    localStorage.setItem('notification-prompt-dismissed', 'true');
    onClose?.();
  };

  const handleLater = () => {
    setVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any).startX = touch.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = (e.currentTarget as any).startX || touch.clientX;
    const diff = touch.clientX - startX;
    
    // Only allow swipe up
    if (diff < 0) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -80) {
      handleDismiss();
    }
    setSwipeOffset(0);
  };

  // Role-specific content
  const getRoleSpecificContent = () => {
    if (role === 'provider') {
      return {
        title: 'Never miss a job request',
        description: 'Get instant alerts for new job opportunities and customer messages',
        benefits: [
          { icon: Calendar, text: 'New job requests' },
          { icon: MessageSquare, text: 'Customer messages' },
          { icon: CreditCard, text: 'Payment updates' },
        ],
      };
    }
    return {
      title: 'Stay in the loop',
      description: 'Get instant updates about your bookings and provider messages',
      benefits: [
        { icon: Calendar, text: 'Booking updates' },
        { icon: MessageSquare, text: 'Provider messages' },
        { icon: CreditCard, text: 'Payment confirmations' },
      ],
    };
  };

  const content = getRoleSpecificContent();

  if (permission !== 'default' || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            x: swipeOffset < 0 ? swipeOffset : 0 
          }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-md touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Card className="shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{content.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleDismiss}
                      className="h-7 w-7 -mt-1 -mr-2 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {content.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-4">
                    {content.benefits.map((benefit, index) => {
                      const Icon = benefit.icon;
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">{benefit.text}</span>
                        </div>
                      );
                    })}
                  </div>

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

                  {/* Swipe hint */}
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Swipe left to dismiss
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};