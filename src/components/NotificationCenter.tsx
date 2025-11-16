import { useEffect, useState, useRef } from 'react';
import { Bell, Settings2, Check, X, MessageSquare, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  body: string;
  target_url: string | null;
  read_status: boolean;
  created_at: string;
  type?: 'booking' | 'message' | 'payment' | 'reminder' | 'info';
  priority?: 'high' | 'medium' | 'low';
  action_data?: {
    booking_id?: string;
    action_type?: 'accept' | 'reject' | 'reply';
  };
}

interface NotificationCenterProps {
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationCenter = ({ onClose, onUnreadCountChange }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi6Azv');
  }, []);

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications((data as unknown as Notification[]) || []);
      const count = ((data as unknown as Notification[])?.filter(n => !n.read_status).length) || 0;
      setUnreadCount(count);
      onUnreadCountChange?.(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;

      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${data.user.id}`
        }, (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => {
            const newCount = prev + 1;
            onUnreadCountChange?.(newCount);
            return newCount;
          });
          
          // Play sound and vibrate
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
          if (window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100]);
          }
        })
        .subscribe();
    });
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications' as any)
        .update({ read_status: true } as any)
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read_status: true } : n))
      );
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1);
        onUnreadCountChange?.(newCount);
        return newCount;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications' as any)
        .update({ read_status: true } as any)
        .eq('user_id', user.id)
        .eq('read_status', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
      setUnreadCount(0);
      onUnreadCountChange?.(0);
      
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_status) {
      await markAsRead(notification.id);
    }

    if (notification.target_url) {
      navigate(notification.target_url);
      setOpen(false);
      if (onClose) onClose();
    }
  };

  const handleDismiss = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(notificationId);
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const getDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays <= 7) return 'This Week';
    return 'Older';
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const group = getDateGroup(notification.created_at);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'message': return MessageSquare;
      case 'payment': return CreditCard;
      case 'reminder': return AlertCircle;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-primary';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen && onClose) onClose();
      
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative min-h-[44px] min-w-[44px] h-11 w-11 rounded-full touch-manipulation active:scale-95 transition-transform"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs pointer-events-none">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="space-y-3 p-6 pb-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Notifications</SheetTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/customer/settings')}
                className="h-9 w-9 touch-manipulation active:scale-95"
                aria-label="Settings"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
              {notifications.some(n => !n.read_status) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-9 px-3 touch-manipulation active:scale-95"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-7rem)]">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 border-b">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
                <div key={dateGroup}>
                  <div className="sticky top-0 bg-muted/30 backdrop-blur-sm px-4 py-2 text-xs font-medium text-muted-foreground z-10">
                    {dateGroup}
                  </div>
                  
                  {groupNotifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const priorityColor = getPriorityColor(notification.priority);
                    
                    return (
                      <div
                        key={notification.id}
                        className="relative group"
                      >
                        <div
                          className={`p-4 cursor-pointer hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation ${
                            !notification.read_status ? 'bg-accent/5' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 p-2 rounded-full ${priorityColor} bg-opacity-10 flex-shrink-0`}>
                              <Icon className={`h-4 w-4 ${priorityColor.replace('bg-', 'text-')}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="font-medium text-sm leading-tight">
                                  {notification.title}
                                </p>
                                {!notification.read_status && (
                                  <div className={`h-2 w-2 rounded-full ${priorityColor} flex-shrink-0 mt-1`} />
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {notification.body}
                              </p>
                              
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDismiss(notification.id, e)}
                                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 touch-manipulation active:scale-95"
                                  aria-label="Dismiss"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* Action buttons */}
                              {notification.action_data && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {notification.action_data.action_type === 'accept' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle accept
                                        }}
                                        className="h-9 text-xs px-4 touch-manipulation active:scale-95"
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Accept
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle decline
                                        }}
                                        className="h-9 text-xs px-4 touch-manipulation active:scale-95"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Decline
                                      </Button>
                                    </>
                                  )}
                                  {notification.action_data.action_type === 'reply' && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle reply
                                      }}
                                      className="h-9 text-xs px-4 touch-manipulation active:scale-95"
                                    >
                                      <MessageSquare className="h-3 w-3 mr-1" />
                                      Reply
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
