import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings, LogOut, Key, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface SettingsDrawerProps {
  role: 'customer' | 'provider';
}

const SettingsDrawer = ({ role }: SettingsDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('customer');

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  // Sync language from database to i18n
  useEffect(() => {
    if (profile?.language && profile.language !== i18n.language) {
      i18n.changeLanguage(profile.language);
    }
  }, [profile?.language, i18n]);

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
      toast.success('✅ Changes saved');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save changes');
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.functions.invoke('request-password-reset', {
        body: { email: profile.email }
      });

      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reset email');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className="btn btn-circle btn-ghost hover:bg-primary/10 hover:scale-105 transition-all duration-200 touch-target shadow-sm hover:shadow-md border border-transparent hover:border-primary/20"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 text-primary" />
        </button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh] flex flex-col">
        <DrawerHeader className="border-b shrink-0">
          <DrawerTitle>{t('settings.title')}</DrawerTitle>
          <DrawerDescription>
            {t('settings.description')}
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="px-4 pb-8 pt-4 space-y-4">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.accountInfo')}</CardTitle>
                  <CardDescription>{t('settings.accountInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('settings.firstName')}</Label>
                      <Input
                        value={profile?.first_name || ''}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        onBlur={() => updateSetting('first_name', profile.first_name)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('settings.lastName')}</Label>
                      <Input
                        value={profile?.last_name || ''}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        onBlur={() => updateSetting('last_name', profile.last_name)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.phone')}</Label>
                    <Input
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      onBlur={() => updateSetting('phone', profile.phone)}
                      placeholder="+351 XXX XXX XXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.email')}</Label>
                    <Input
                      value={profile?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">{t('settings.emailNote')}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Provider-specific settings */}
              {role === 'provider' && (
                <>
                  {/* Availability Preferences */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Availability Preferences</CardTitle>
                      <CardDescription>Manage your work preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Accept Recurring Clients</Label>
                          <p className="text-sm text-muted-foreground">Allow customers to book you regularly</p>
                        </div>
                      <Switch
                        checked={profile?.accept_recurring ?? false}
                        onCheckedChange={(checked) => updateSetting('accept_recurring', checked)}
                      />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Currently Available</Label>
                          <p className="text-sm text-muted-foreground">Show as available for new bookings</p>
                        </div>
                      <Switch
                        checked={profile?.available_status ?? true}
                        onCheckedChange={(checked) => updateSetting('available_status', checked)}
                      />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Verification */}
                  <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Verification
                      </CardTitle>
                      <CardDescription>Boost your profile credibility</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-primary to-accent"
                        onClick={() => {
                          setOpen(false);
                          navigate('/provider/verify');
                        }}
                      >
                        Become Verified
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Verified providers get more bookings and customer trust
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Customer-specific settings */}
              {role === 'customer' && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('settings.currencyPreference')}</CardTitle>
                    <CardDescription>{t('settings.currencyPreferenceDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={profile?.currency || 'EUR'}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('settings.currencyNote')}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.notifications')}</CardTitle>
                  <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.emailNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.emailNotificationsDesc')}
                      </p>
                    </div>
                  <Switch
                    checked={profile?.notifications_enabled ?? true}
                    onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
                  />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.smsNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.smsNotificationsDesc')}
                      </p>
                    </div>
                  <Switch
                    checked={profile?.sms_notifications ?? true}
                    onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
                  />
                  </div>
                </CardContent>
              </Card>

              {/* Language */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.languageRegion')}</CardTitle>
                  <CardDescription>{t('settings.languageRegionDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <LanguageSwitcher />
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings.security')}</CardTitle>
                  <CardDescription>{t('settings.securityDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handlePasswordReset}
                    className="w-full"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    {t('settings.changePassword')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('settings.changePasswordNote')}
                  </p>
                </CardContent>
              </Card>

              {/* Logout */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('profile.logout')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
