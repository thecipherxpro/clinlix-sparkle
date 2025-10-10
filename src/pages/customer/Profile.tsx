import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import MobileNav from "@/components/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const navigate = useNavigate();
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
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Profile
          </h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-2xl">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-16 w-16 border-2 border-border shadow-md">
                <AvatarImage src={formData.avatar_url || undefined} alt={`${formData.first_name} ${formData.last_name}`} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                  {formData.first_name[0]}{formData.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-muted-foreground">{formData.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Customer Account
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={formData.email}
                  type="email"
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+351 XXX XXX XXX"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({
                      ...formData,
                      country: value,
                      currency: value === 'Portugal' ? 'EUR' : 'CAD'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portugal">🇵🇹 Portugal</SelectItem>
                      <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input
                    value={formData.currency}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div>
                <Label>Language *</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label htmlFor="avatar_url">Profile Picture URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar_url || ''}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full h-12 sm:h-10" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-0 shadow-sm mt-6 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full h-12 sm:h-10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Profile;
