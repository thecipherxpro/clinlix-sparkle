import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

interface SettingsDrawerProps {
  role: 'customer' | 'provider';
}

const SettingsDrawer = ({ role }: SettingsDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

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
      const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;
      toast.success('Password reset email sent');
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
        <Button
          variant="ghost"
          size="icon"
          className="touch-target"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b">
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage your account settings and preferences
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-full">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="px-4 pb-8 pt-4 space-y-4">
              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Your basic account details</CardDescription>
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
                    <CardTitle>Currency Preference</CardTitle>
                    <CardDescription>Based on your country selection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={profile?.currency || 'EUR'}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Currency is automatically set based on your country
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive {role === 'provider' ? 'job' : 'booking'} updates via email
                      </p>
                    </div>
                    <Switch
                      checked={profile?.notifications_enabled ?? true}
                      onCheckedChange={(checked) => updateSetting('notifications_enabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive {role === 'provider' ? 'job' : 'booking'} updates via SMS
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
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>Choose your preferred language</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={profile?.language || 'en'}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handlePasswordReset}
                    className="w-full"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We'll send you an email with instructions to reset your password
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
