import { useEffect, useState, useRef } from 'react';
import { Bell, Settings2, Check, X, MessageSquare, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  const [swipeStates, setSwipeStates] = useState<Record<string, number>>({});
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
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data,
        error
      } = await supabase.from('notifications' as any).select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(20);
      if (error) throw error;
      setNotifications(data as unknown as Notification[] || []);
      const count = (data as unknown as Notification[])?.filter(n => !n.read_status).length || 0;
      setUnreadCount(count);
      onUnreadCountChange?.(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  const subscribeToNotifications = () => {
    supabase.auth.getUser().then(({
      data
    }) => {
      if (!data.user) return;
      const channel = supabase.channel('notifications').on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${data.user.id}`
      }, payload => {
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
      }).subscribe();
    });
  };
  const markAsRead = async (notificationId: string) => {
    try {
      const {
        error
      } = await supabase.from('notifications' as any).update({
        read_status: true
      } as any).eq('id', notificationId);
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === notificationId ? {
        ...n,
        read_status: true
      } : n));
      setUnreadCount(prev => {
        const newCount = Math.max(0, prev - 1);
        onUnreadCountChange?.(newCount);
        return newCount;
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.target_url) {
      setOpen(false);
      onClose?.();
      navigate(notification.target_url);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    // Haptic feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(newOpen ? 50 : 30);
    }
    
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const unreadIds = notifications
        .filter(n => !n.read_status)
        .map(n => n.id);

      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('notifications' as any)
        .update({ read_status: true } as any)
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
      setUnreadCount(0);
      onUnreadCountChange?.(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return 'This Week';
    return 'Older';
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const group = getDateGroup(notification.created_at);
    if (!groups[group]) groups[group] = [];
    groups[group].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const getNotificationIcon = (notification: Notification) => {
    if (notification.title.toLowerCase().includes('booking') || notification.title.toLowerCase().includes('job')) {
      return <Calendar className="w-4 h-4" />;
    }
    if (notification.title.toLowerCase().includes('message')) {
      return <MessageSquare className="w-4 h-4" />;
    }
    if (notification.title.toLowerCase().includes('payment')) {
      return <CreditCard className="w-4 h-4" />;
    }
    return <Bell className="w-4 h-4" />;
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const handleSwipeStart = (e: React.TouchEvent, notificationId: string) => {
    const touch = e.touches[0];
    setSwipeStates(prev => ({ ...prev, [notificationId]: touch.clientX }));
  };

  const handleSwipeMove = (e: React.TouchEvent, notificationId: string) => {
    const touch = e.touches[0];
    const startX = swipeStates[notificationId];
    if (startX) {
      const diff = touch.clientX - startX;
      if (diff > 0) {
        (e.currentTarget as HTMLElement).style.transform = `translateX(${Math.min(diff, 100)}px)`;
      }
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent, notification: Notification) => {
    const element = e.currentTarget as HTMLElement;
    const startX = swipeStates[notification.id];
    const touch = e.changedTouches[0];
    const diff = touch.clientX - startX;
    
    if (diff > 80) {
      // Swipe right - mark as read and dismiss
      markAsRead(notification.id);
      element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      element.style.transform = 'translateX(100%)';
      element.style.opacity = '0';
    } else {
      // Reset position
      element.style.transition = 'transform 0.2s ease-out';
      element.style.transform = 'translateX(0)';
    }
    
    setSwipeStates(prev => {
      const newState = { ...prev };
      delete newState[notification.id];
      return newState;
    });
  };
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          className="relative p-2 rounded-full bg-background/80 hover:bg-background transition-all duration-200 border border-border/50 hover:border-primary/30 hover:scale-105 active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-foreground" strokeWidth={2} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex items-center justify-center h-5 w-5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-background">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-8"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setOpen(false);
                  navigate('/customer/settings');
                }}
                className="h-8 w-8"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
                <div key={group}>
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2 px-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {group}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {groupNotifications.map(notification => (
                      <div
                        key={notification.id}
                        onTouchStart={(e) => handleSwipeStart(e, notification.id)}
                        onTouchMove={(e) => handleSwipeMove(e, notification.id)}
                        onTouchEnd={(e) => handleSwipeEnd(e, notification)}
                        className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                          !notification.read_status ? 'bg-primary/5 border-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ${
                            getPriorityColor(notification.priority)
                          }`}>
                            {getNotificationIcon(notification)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {notification.title}
                              </h4>
                              {!notification.read_status && (
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {notification.body}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted-foreground">
                                {formatDate(notification.created_at)}
                              </p>
                              
                              {notification.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs h-5">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            
                            {/* Action buttons for specific notification types */}
                            {notification.action_data && (
                              <div className="flex gap-2 mt-3">
                                {notification.action_data.action_type === 'accept' && (
                                  <>
                                    <Button
                                      size="sm"
                                      className="flex-1 h-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleNotificationClick(notification);
                                      }}
                                    >
                                      <Check className="w-3 h-3 mr-1" />
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 h-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                    >
                                      <X className="w-3 h-3 mr-1" />
                                      Decline
                                    </Button>
                                  </>
                                )}
                                
                                {notification.action_data.action_type === 'reply' && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full h-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationClick(notification);
                                    }}
                                  >
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    Reply
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Swipe indicator */}
                        {!notification.read_status && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs text-muted-foreground">Swipe to dismiss →</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        </SheetContent>
    </Sheet>
  );
};