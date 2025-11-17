import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useI18n } from "@/contexts/I18nContext";

const CustomerSettings = () => {
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

      if (profileData?.role !== 'customer') {
        navigate('/provider/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/profile')} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">{t.settings.customerSettings}</h1>
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
                <Label>{t.settings.firstName}</Label>
                <Input
                  value={profile?.first_name || ''}
                  onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  onBlur={() => updateSetting('first_name', profile.first_name)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.settings.lastName}</Label>
                <Input
                  value={profile?.last_name || ''}
                  onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  onBlur={() => updateSetting('last_name', profile.last_name)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.settings.phoneNumber}</Label>
              <Input
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                onBlur={() => updateSetting('phone', profile.phone)}
                placeholder="+351 XXX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <Label>{t.settings.emailAddress}</Label>
              <Input
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t.settings.emailCannotChange}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={profile?.gender || ''}
                  onValueChange={(value) => updateSetting('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={profile?.date_of_birth || ''}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  onBlur={() => updateSetting('date_of_birth', profile.date_of_birth)}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residential Address */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Residential Address</CardTitle>
            <CardDescription>Your personal address for security purposes (separate from service addresses)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input
                value={profile?.residential_street || ''}
                onChange={(e) => setProfile({ ...profile, residential_street: e.target.value })}
                onBlur={() => updateSetting('residential_street', profile.residential_street)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="space-y-2">
              <Label>Apartment/Unit</Label>
              <Input
                value={profile?.residential_apt_unit || ''}
                onChange={(e) => setProfile({ ...profile, residential_apt_unit: e.target.value })}
                onBlur={() => updateSetting('residential_apt_unit', profile.residential_apt_unit)}
                placeholder="Apt 4B (Optional)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={profile?.residential_city || ''}
                  onChange={(e) => setProfile({ ...profile, residential_city: e.target.value })}
                  onBlur={() => updateSetting('residential_city', profile.residential_city)}
                  placeholder="Lisbon"
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={profile?.residential_postal_code || ''}
                  onChange={(e) => setProfile({ ...profile, residential_postal_code: e.target.value })}
                  onBlur={() => updateSetting('residential_postal_code', profile.residential_postal_code)}
                  placeholder="1000-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Province/State</Label>
              <Input
                value={profile?.residential_province || ''}
                onChange={(e) => setProfile({ ...profile, residential_province: e.target.value })}
                onBlur={() => updateSetting('residential_province', profile.residential_province)}
                placeholder="Lisboa"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Select
                value={profile?.residential_country || 'Portugal'}
                onValueChange={(value) => updateSetting('residential_country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portugal">Portugal</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                </SelectContent>
              </Select>
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
                <Label className="text-base">{t.settings.pushNotifications}</Label>
                <p className="text-sm text-muted-foreground">{t.settings.pushNotificationsDesc}</p>
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
                <Label className="text-base">{t.settings.emailNotifications}</Label>
                <p className="text-sm text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
              </div>
            <Switch
              checked={profile?.notifications_enabled ?? true}
              onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
              className="ml-auto"
            />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="space-y-0.5 flex-1">
                <Label className="text-base">{t.settings.smsNotifications}</Label>
                <p className="text-sm text-muted-foreground">{t.settings.smsNotificationsDesc}</p>
              </div>
            <Switch
              checked={profile?.sms_notifications ?? true}
              onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
              className="ml-auto"
            />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.settings.language}</CardTitle>
            <CardDescription>{t.settings.languageDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={profile?.language || 'en'}
              onValueChange={(value) => updateSetting('language', value)}
            >
              <SelectTrigger className="h-11 text-base">
                <SelectValue placeholder={t.settings.selectLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Currency Preference */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t.settings.currencyPreference}</CardTitle>
            <CardDescription>{t.settings.currencyDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={profile?.currency || 'EUR'}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {t.settings.currencyAuto}
            </p>
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

export default CustomerSettings;
