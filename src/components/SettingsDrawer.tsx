import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, Key, CheckCircle, Bell, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { banner } from "@/hooks/use-banner";
import NotificationPreferences from "@/components/NotificationPreferences";

interface SettingsDrawerProps {
  role: 'customer' | 'provider';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsDrawer = ({ role, open: controlledOpen, onOpenChange }: SettingsDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      setLoading(true);
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
      banner.error('Failed to load settings');
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
      banner.success('Changes saved');
    } catch (error) {
      console.error('Error:', error);
      banner.error('Failed to save changes');
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.functions.invoke('request-password-reset', {
        body: { email: profile.email }
      });

      if (error) throw error;
      banner.success('Password reset email sent! Check your inbox.');
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      banner.error('Failed to send reset email');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      banner.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      banner.error("Failed to logout");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        <DrawerHeader className="border-b shrink-0 pb-3 sm:pb-4">
          <DrawerTitle className="text-xl font-semibold">Settings</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 overflow-y-auto px-3 sm:px-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
              {/* Account Information */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-xs">Your basic account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="text-xs font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile?.first_name || ''}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        onBlur={() => updateSetting('first_name', profile.first_name)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="text-xs font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile?.last_name || ''}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        onBlur={() => updateSetting('last_name', profile.last_name)}
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      onBlur={() => updateSetting('phone', profile.phone)}
                      placeholder="+351 XXX XXX XXX"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="h-9 text-sm bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </CardContent>
              </Card>

              {/* Provider-specific settings */}
              {role === 'provider' && (
                <>
                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Provider Settings
                      </CardTitle>
                      <CardDescription className="text-xs">Manage your job availability</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between gap-4 py-2">
                        <div className="flex-1">
                          <Label htmlFor="availability" className="text-sm font-medium">Available for Jobs</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Show your profile to customers</p>
                        </div>
                        <Switch
                          id="availability"
                          checked={profile?.available_status || false}
                          onCheckedChange={(checked) => updateSetting('available_status', checked)}
                          className="touch-target"
                        />
                      </div>
                      <div className="h-px bg-border/50" />
                      <div className="flex items-center justify-between gap-4 py-2">
                        <div className="flex-1">
                          <Label htmlFor="recurring" className="text-sm font-medium">Accept Recurring Jobs</Label>
                          <p className="text-xs text-muted-foreground mt-0.5">Receive scheduled bookings</p>
                        </div>
                        <Switch
                          id="recurring"
                          checked={profile?.accept_recurring || false}
                          onCheckedChange={(checked) => updateSetting('accept_recurring', checked)}
                          className="touch-target"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Verification Status
                      </CardTitle>
                      <CardDescription className="text-xs">Your account verification</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
                        <p className="text-xs text-center text-muted-foreground">
                          Contact support to update your verification status
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Customer-specific settings */}
              {role === 'customer' && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Preferences</CardTitle>
                    <CardDescription className="text-xs">Your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="currency" className="text-xs font-medium">Currency</Label>
                      <Select
                        value={profile?.currency || 'EUR'}
                        onValueChange={(value) => updateSetting('currency', value)}
                      >
                        <SelectTrigger className="h-9 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs">Manage notification preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationPreferences role={role} />
                </CardContent>
              </Card>

              {/* Language */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Language</CardTitle>
                  <CardDescription className="text-xs">Choose your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={profile?.language || 'en'}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Security */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Key className="h-4 w-4 text-primary" />
                    Security
                  </CardTitle>
                  <CardDescription className="text-xs">Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePasswordReset}
                    className="w-full h-9 touch-target"
                  >
                    Reset Password
                  </Button>
                </CardContent>
              </Card>

              {/* Logout */}
              <Card className="border-destructive/30 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </CardTitle>
                  <CardDescription className="text-xs">End your current session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full h-9 touch-target"
                  >
                    Logout
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
