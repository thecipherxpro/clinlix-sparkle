import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
interface Notification {
  id: string;
  title: string;
  body: string;
  target_url: string | null;
  read_status: boolean;
  created_at: string;
}
interface NotificationCenterProps {
  onClose?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationCenter = ({ onClose, onUnreadCountChange }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
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
        setNotifications(prev => [payload.new as Notification, ...prev]);
        setUnreadCount(prev => {
          const newCount = prev + 1;
          onUnreadCountChange?.(newCount);
          return newCount;
        });
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
    setOpen(newOpen);
    if (!newOpen) {
      onClose?.();
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
  return <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-100px)] mt-6">
          {loading ? <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div> : notifications.length === 0 ? <div className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div> : <div className="space-y-2">
              {notifications.map(notification => <div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${!notification.read_status ? 'bg-primary/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {notification.body}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read_status && <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>}
                  </div>
                </div>)}
            </div>}
        </ScrollArea>
      </SheetContent>
    </Sheet>;
};