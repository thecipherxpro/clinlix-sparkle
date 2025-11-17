import { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, CreditCard, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { banner } from "@/hooks/use-banner";
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationPreferencesProps {
  role: 'customer' | 'provider';
}

const NotificationPreferences = ({ role }: NotificationPreferencesProps) => {
  const { permission, subscribe, unsubscribe, isLoading } = usePushNotifications();
  const [preferences, setPreferences] = useState({
    push_enabled: false,
    email_enabled: true,
    sms_enabled: true,
    bookings: true,
    messages: true,
    payments: true,
    reminders: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('notifications_enabled, sms_notifications')
        .eq('id', user.id)
        .single();

      if (profile) {
        setPreferences(prev => ({
          ...prev,
          push_enabled: permission === 'granted',
          email_enabled: profile.notifications_enabled ?? true,
          sms_enabled: profile.sms_notifications ?? true,
        }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled) {
      const success = await subscribe();
      if (success) {
        setPreferences(prev => ({ ...prev, push_enabled: true }));
        banner.success('Push notifications enabled');
      }
    } else {
      await unsubscribe();
      setPreferences(prev => ({ ...prev, push_enabled: false }));
      banner.success('Push notifications disabled');
    }
  };

  const updatePreference = async (field: string, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (field === 'email_enabled') {
        await supabase
          .from('profiles')
          .update({ notifications_enabled: value })
          .eq('id', user.id);
      } else if (field === 'sms_enabled') {
        await supabase
          .from('profiles')
          .update({ sms_notifications: value })
          .eq('id', user.id);
      }

      setPreferences(prev => ({ ...prev, [field]: value }));
      banner.success('Preference updated');
    } catch (error) {
      console.error('Error updating preference:', error);
      banner.error('Failed to update preference');
    }
  };

  const notificationTypes = [
    {
      id: 'bookings',
      icon: Calendar,
      label: role === 'provider' ? 'Job Requests' : 'Booking Updates',
      description: role === 'provider' 
        ? 'New job requests, acceptances, and cancellations'
        : 'Booking confirmations, status changes, and cancellations',
      preview: role === 'provider'
        ? 'New job request from Sarah M. - 3BR Home Cleaning'
        : 'Your booking has been confirmed for Dec 15 at 10:00 AM',
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: 'Messages',
      description: 'New messages from ' + (role === 'provider' ? 'customers' : 'providers'),
      preview: role === 'provider'
        ? 'Customer: "Will you be bringing cleaning supplies?"'
        : 'Provider: "I\'m on my way, arriving in 10 minutes"',
    },
    {
      id: 'payments',
      icon: CreditCard,
      label: role === 'provider' ? 'Earnings' : 'Payments',
      description: role === 'provider'
        ? 'Payment received, earnings updates, and payout notifications'
        : 'Payment confirmations and receipt notifications',
      preview: role === 'provider'
        ? 'Payment received: €75.00 for completed job'
        : 'Payment successful - €75.00 charged to your card',
    },
    {
      id: 'reminders',
      icon: Bell,
      label: 'Reminders',
      description: role === 'provider'
        ? 'Upcoming job reminders and availability prompts'
        : 'Upcoming booking reminders and rebooking suggestions',
      preview: role === 'provider'
        ? 'Reminder: Job starts in 1 hour at 123 Main St'
        : 'Reminder: Your cleaning is scheduled for tomorrow at 10 AM',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Push Notifications Master Toggle */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Push Notifications</CardTitle>
            {permission === 'granted' && (
              <Badge variant="outline" className="ml-auto">
                <Sparkles className="w-3 h-3 mr-1" />
                Enabled
              </Badge>
            )}
          </div>
          <CardDescription>
            Get instant alerts on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 pr-4">
              <Label className="text-base">Enable Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Stay updated with real-time notifications
              </p>
            </div>
            <Switch
              checked={preferences.push_enabled}
              onCheckedChange={handlePushToggle}
              disabled={isLoading}
            />
          </div>

          {permission === 'denied' && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Push notifications are blocked. Enable them in your browser settings to receive alerts.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alternative Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Alternative Channels</CardTitle>
          <CardDescription>Receive notifications via email or SMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 pr-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates in your inbox
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.email_enabled}
              onCheckedChange={(checked) => updatePreference('email_enabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 pr-4">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get text messages for urgent updates
                </p>
              </div>
            </div>
            <Switch
              checked={preferences.sms_enabled}
              onCheckedChange={(checked) => updatePreference('sms_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={type.id}>
                {index > 0 && <Separator className="mb-6" />}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label className="text-base">{type.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[type.id as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, [type.id]: checked }))
                      }
                    />
                  </div>
                  
                  {/* Preview Example */}
                  <div className="ml-11 p-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm font-medium mb-1">Preview</p>
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">{type.preview}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPreferences;
