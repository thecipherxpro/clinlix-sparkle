import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { ArrowLeft, User, Star, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import ProviderMobileNav from "@/components/ProviderMobileNav";
import AvatarUploader from "@/components/AvatarUploader";
import SettingsDrawer from "@/components/SettingsDrawer";


const ProviderProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);

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

      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProviderProfile(providerData);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update provider_profiles table
      if (providerProfile) {
        const { error: providerError } = await supabase
          .from('provider_profiles')
          .update({
            full_name: `${profile.first_name} ${profile.last_name}`,
            bio: providerProfile.bio,
            experience_years: providerProfile.experience_years,
            skills: providerProfile.skills,
            service_areas: providerProfile.service_areas,
            languages: providerProfile.languages,
            photo_url: providerProfile.photo_url,
          })
          .eq('user_id', user.id);

        if (providerError) throw providerError;
      }

      // Update profile country
      const { error: countryError } = await supabase
        .from('profiles')
        .update({ country: profile.country })
        .eq('id', user.id);

      if (countryError) throw countryError;

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/provider/dashboard')} className="touch-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold">My Profile</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Manage your information</p>
              </div>
            </div>
            <SettingsDrawer role="provider" />
          </div>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-2xl mx-auto space-y-4 md:space-y-6">
        {/* Stats Card */}
        {providerProfile && (
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AvatarUploader 
                  size={80}
                  editable={true}
                  role="provider"
                  onUploadSuccess={() => loadProfile()}
                />
                <div>
                  <div className="text-2xl font-bold">{providerProfile.full_name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{Number(providerProfile.rating_avg).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({providerProfile.rating_count} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
            <CardDescription>Update your basic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile?.first_name || ''}
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                  className="touch-target"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile?.last_name || ''}
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                  className="touch-target"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="touch-target"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Provider Information */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Provider Information</CardTitle>
            <CardDescription>Details about your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={profile?.country || 'Portugal'}
                onValueChange={(value) => setProfile({...profile, country: value})}
              >
                <SelectTrigger className="touch-target">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portugal">Portugal</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell customers about yourself..."
                rows={4}
                maxLength={500}
                value={providerProfile?.bio || ''}
                onChange={(e) => setProviderProfile({...providerProfile, bio: e.target.value})}
                className="resize-none touch-target"
              />
              <p className="text-xs text-muted-foreground text-right">
                {(providerProfile?.bio || '').length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="30"
                value={providerProfile?.experience_years || 0}
                onChange={(e) => setProviderProfile({...providerProfile, experience_years: parseInt(e.target.value) || 0})}
                className="touch-target"
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <MultiSelect
                options={[
                  'Basic Cleaning',
                  'Deep Cleaning',
                  'Move-In/Out',
                  'Post-Construction',
                  'Window Cleaning',
                  'Carpet Cleaning',
                  'Laundry',
                  'Ironing',
                  'Organization'
                ]}
                selected={providerProfile?.skills || []}
                onChange={(skills) => setProviderProfile({...providerProfile, skills})}
                placeholder="Select skills..."
              />
            </div>
            <div className="space-y-2">
              <Label>Service Areas</Label>
              <MultiSelect
                options={
                  profile?.country === 'Portugal'
                    ? ['Lisbon', 'Porto', 'Braga', 'Faro', 'Coimbra', 'Aveiro', 'Setúbal']
                    : ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton']
                }
                selected={providerProfile?.service_areas || []}
                onChange={(service_areas) => setProviderProfile({...providerProfile, service_areas})}
                placeholder="Select service areas..."
              />
            </div>
            <div className="space-y-2">
              <Label>Languages</Label>
              <MultiSelect
                options={['English', 'Portuguese', 'Spanish', 'French', 'Mandarin']}
                selected={providerProfile?.languages || []}
                onChange={(languages) => setProviderProfile({...providerProfile, languages})}
                placeholder="Select languages..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleSaveProfile} 
            disabled={saving}
            className="flex-1 touch-target"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/providers/profile/${providerProfile?.id}`)}
            className="flex-1 touch-target"
            disabled={!providerProfile?.id}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Public Profile
          </Button>
        </div>
      </main>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderProfilePage;
