import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, Switch } from "@heroui/react";
import { ArrowLeft, Key } from "lucide-react";
import { toast } from "sonner";
import MobileNav from "@/components/MobileNav";

const CustomerSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

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
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reset email');
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
          <h1 className="text-xl sm:text-2xl font-bold">Customer Settings</h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-2xl space-y-4">
        {/* Account Info */}
        <Card className="border-0 shadow-sm">
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

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive booking updates via email</p>
              </div>
              <Switch
                isSelected={profile?.notifications_enabled ?? true}
                onValueChange={(checked) => updateSetting('notifications_enabled', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive booking updates via SMS</p>
              </div>
              <Switch
                isSelected={profile?.sms_notifications ?? true}
                onValueChange={(checked) => updateSetting('sms_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              label="Select Language"
              selectedKeys={[profile?.language || 'en']}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                updateSetting('language', value);
              }}
              className="w-full"
            >
              <SelectItem key="en">🇬🇧 English</SelectItem>
              <SelectItem key="pt">🇵🇹 Portuguese</SelectItem>
            </Select>
          </CardContent>
        </Card>

        {/* Currency Preference */}
        <Card className="border-0 shadow-sm">
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

        {/* Security */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handlePasswordReset}
              className="w-full"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              We'll send you an email with instructions to reset your password
            </p>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default CustomerSettings;
