import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Key, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useI18n } from "@/contexts/I18nContext";

const ProviderSettings = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const { isSubscribed, subscribe, unsubscribe, isLoading: pushLoading } = usePushNotifications();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData?.role !== 'provider') {
        navigate('/customer/dashboard');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (field: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, [field]: value });
      toast.success(t.settings.changesSaved);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t.settings.failedToSave);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.functions.invoke('request-password-reset', {
        body: { email: profile.email }
      });

      if (error) throw error;
      toast.success(t.settings.passwordResetSent);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t.settings.failedToSendReset);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/provider/profile')} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">{t.settings.providerSettings}</h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-2xl space-y-4">
        {/* Account Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.settings.accountInfo}</CardTitle>
            <CardDescription>{t.settings.accountDetails}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={profile?.first_name || ''}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  onBlur={() => updateSetting('first_name', profile.first_name)}
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={profile?.last_name || ''}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  onBlur={() => updateSetting('last_name', profile.last_name)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                onBlur={() => updateSetting('phone', profile.phone)}
                placeholder="+351 XXX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Availability Preferences */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.provider.availabilityPreferences}</CardTitle>
            <CardDescription>{t.provider.availabilityDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">{t.provider.acceptRecurring}</Label>
                <p className="text-sm text-muted-foreground">{t.provider.acceptRecurringDesc}</p>
              </div>
            <Switch
              checked={profile?.accept_recurring ?? false}
              onCheckedChange={(checked) => updateSetting('accept_recurring', checked)}
              className="ml-auto"
            />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">{t.provider.currentlyAvailable}</Label>
                <p className="text-sm text-muted-foreground">{t.provider.currentlyAvailableDesc}</p>
              </div>
            <Switch
              checked={profile?.available_status ?? true}
              onCheckedChange={(checked) => updateSetting('available_status', checked)}
              className="ml-auto"
            />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.settings.notifications}</CardTitle>
            <CardDescription>{t.settings.notificationsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive real-time job updates</p>
              </div>
            <Switch
              checked={isSubscribed}
              onCheckedChange={async (checked) => {
                if (checked) {
                  const success = await subscribe();
                  if (success) toast.success(t.settings.pushEnabled);
                } else {
                  await unsubscribe();
                  toast.success(t.settings.pushDisabled);
                }
              }}
              disabled={pushLoading}
              className="ml-auto"
            />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive job updates via email</p>
              </div>
            <Switch
              checked={profile?.notifications_enabled ?? true}
              onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
              className="ml-auto"
            />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive job updates via SMS</p>
              </div>
            <Switch
              checked={profile?.sms_notifications ?? true}
              onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
              className="ml-auto"
            />
            </div>
          </CardContent>
        </Card>

        {/* Verification */}
        <Card className="border-0 shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              {t.provider.verification}
            </CardTitle>
            <CardDescription>{t.provider.verificationDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-primary to-accent"
              onClick={() => navigate('/provider/verify')}
            >
              {t.provider.becomeVerified}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t.provider.verifiedInfo}
            </p>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.provider.languageRegion}</CardTitle>
            <CardDescription>{t.settings.languageDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={profile?.language || 'en'}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger className="h-11 text-base">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.settings.security}</CardTitle>
            <CardDescription>{t.settings.securityDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              {t.settings.changePassword}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              {t.settings.passwordResetInfo}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProviderSettings;
