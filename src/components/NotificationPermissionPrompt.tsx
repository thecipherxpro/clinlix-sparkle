import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export const NotificationPermissionPrompt = () => {
  const [show, setShow] = useState(false);
  const { permission, requestPermission, loading } = usePushNotifications();

  useEffect(() => {
    // Show prompt after a short delay if permission is default
    const timer = setTimeout(() => {
      if (permission === 'default') {
        setShow(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [permission]);

  if (!show || permission !== 'default') return null;

  const handleAllow = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Stay Updated</CardTitle>
              <CardDescription className="mt-1">
                Clinlix would like to send you updates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Receive real-time notifications about your bookings, job requests, and important updates.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#6E45E2] to-[#8365FB] hover:opacity-90"
            >
              Allow Notifications
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1"
            >
              Not Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
