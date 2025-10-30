import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut, Save, User, Settings, Shield } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/base/avatar/avatar";
import { useI18n } from "@/contexts/I18nContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Profile = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Portugal",
    currency: "EUR",
    avatar_url: ""
  });

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  const checkAuthAndFetchProfile = async () => {
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
      setFormData({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        country: profileData.country || "Portugal",
        currency: profileData.currency || "EUR",
        avatar_url: profileData.avatar_url || ""
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          country: formData.country,
          currency: formData.currency,
          avatar_url: formData.avatar_url
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success(t.settings.changesSaved);
      checkAuthAndFetchProfile();
    } catch (error: any) {
      toast.error(error.message || t.errors.updateFailed);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(t.common.logoutSuccess);
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => navigate('/customer/dashboard')} 
              className="lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t.common.profile}</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar
                src={formData.avatar_url}
                alt={`${formData.first_name} ${formData.last_name}`}
                size="4xl"
                fallback={`${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`}
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-bold mb-1">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-muted-foreground text-lg mb-2">{formData.email}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <User className="w-4 h-4" />
                  {t.common.customer}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid mb-8">
            <TabsTrigger value="personal" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal Info</span>
              <span className="sm:hidden">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">{t.common.firstName}</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">{t.common.lastName}</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        required
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.common.email}</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      type="email"
                      disabled
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.settings.emailCannotChange}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.common.phone}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+351 XXX XXX XXX"
                      className="h-11"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? t.common.saving : t.common.saveChanges}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Manage your location and currency preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country">{t.common.country}</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      disabled
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.settings.countryCannotChange}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t.common.currency}</Label>
                    <Input
                      id="currency"
                      value={formData.currency}
                      disabled
                      className="h-11"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>{t.settings.language}</Label>
                  <LanguageSwitcher />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account security and session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                  size="lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.common.logout}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
