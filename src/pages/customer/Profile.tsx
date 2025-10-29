import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import AvatarUploader from "@/components/AvatarUploader";
import SettingsDrawer from "@/components/SettingsDrawer";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Profile = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('customer');
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
    language: "en",
    avatar_url: ""
  });

  useEffect(() => {
    checkAuthAndFetchProfile();
  }, []);

  // Sync language from database to i18n
  useEffect(() => {
    if (profile?.language && profile.language !== i18n.language) {
      i18n.changeLanguage(profile.language);
    }
  }, [profile?.language, i18n]);

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
        language: profileData.language || "en",
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
          language: formData.language,
          avatar_url: formData.avatar_url
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      checkAuthAndFetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => navigate('/customer/dashboard')} 
              className="touch-target md:hidden"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('profile.title')}
            </h1>
          </div>
          <SettingsDrawer role="customer" />
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-2xl">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <AvatarUploader 
                size={80}
                editable={true}
                role="customer"
                onUploadSuccess={() => checkAuthAndFetchProfile()}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-muted-foreground">{formData.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('profile.customerAccount')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>{t('profile.accountInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>{t('profile.firstName')} *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    className="h-11 text-base"
                  />
                </div>
                <div>
                  <Label>{t('profile.lastName')} *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div>
                <Label>{t('profile.email')}</Label>
                <Input
                  value={formData.email}
                  type="email"
                  disabled
                  className="bg-muted h-11 text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t('profile.emailNote')}
                </p>
              </div>

              <div>
                <Label>{t('profile.phone')}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+351 XXX XXX XXX"
                  className="h-11 text-base"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">{t('profile.country')} *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      country: value,
                      currency: value === 'Portugal' ? 'EUR' : 'CAD'
                    })}
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                      <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">{t('profile.currency')}</Label>
                  <Input
                    id="currency"
                    value={formData.currency}
                    disabled
                    className="bg-muted h-11 text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="language">{t('profile.language')} *</Label>
                <LanguageSwitcher />
              </div>

              <Separator />


              <Button type="submit" className="w-full h-12 sm:h-10" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? t('profile.saving') : t('profile.saveChanges')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-sm mt-6 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">{t('profile.dangerZone')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full h-12 sm:h-10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('profile.logout')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
