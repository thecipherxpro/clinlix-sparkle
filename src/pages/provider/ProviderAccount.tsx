import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut, Save, User, MapPin, UserCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { ProfileFormSkeleton } from "@/components/skeletons/FormSkeleton";
import { profileSchema, ProfileFormData } from "@/lib/schemas/profileSchema";
import { AccountInfoFields } from "@/components/forms/AccountInfoFields";
import { DemographicsFields } from "@/components/forms/DemographicsFields";
import { ResidentialAddressFields } from "@/components/forms/ResidentialAddressFields";
import AvatarUploader from "@/components/AvatarUploader";

const ProviderAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [providerProfile, setProviderProfile] = useState<any>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: "prefer_not_to_say",
      date_of_birth: "",
      residential_street: "",
      residential_apt_unit: "",
      residential_city: "",
      residential_province: "",
      residential_postal_code: "",
      residential_country: "Portugal",
      country: "Portugal",
      currency: "EUR",
      language: "en"
    }
  });

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

      setUserId(user.id);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profileData?.role !== 'provider') {
        navigate('/customer/dashboard');
        return;
      }

      // Load provider-specific profile
      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProviderProfile(providerData);

      form.reset({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        gender: profileData.gender || "prefer_not_to_say",
        date_of_birth: profileData.date_of_birth || "",
        residential_street: profileData.residential_street || "",
        residential_apt_unit: profileData.residential_apt_unit || "",
        residential_city: profileData.residential_city || "",
        residential_province: profileData.residential_province || "",
        residential_postal_code: profileData.residential_postal_code || "",
        residential_country: (profileData.residential_country === "Canada" ? "Canada" : "Portugal") as "Canada" | "Portugal",
        country: profileData.country || "Portugal",
        currency: profileData.currency || "EUR",
        language: profileData.language || "en"
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: ProfileFormData) => {
    setSaving(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', userId);

      if (profileError) throw profileError;

      // Update provider_profiles table
      if (providerProfile) {
        const { error: providerError } = await supabase
          .from('provider_profiles')
          .update({
            full_name: `${values.first_name} ${values.last_name}`,
          })
          .eq('user_id', userId);

        if (providerError) throw providerError;
      }

      toast.success('Profile updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <ProfileFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/provider/dashboard')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">My Account</CardTitle>
                <CardDescription>
                  Manage your profile information and provider settings
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <AvatarUploader role="provider" editable={true} />
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile" className="gap-2">
                      <User className="w-4 h-4" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="demographics" className="gap-2">
                      <UserCircle className="w-4 h-4" />
                      Demographics
                    </TabsTrigger>
                    <TabsTrigger value="address" className="gap-2">
                      <MapPin className="w-4 h-4" />
                      Residential Address
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="profile" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                      <AccountInfoFields form={form} disabled={saving} />
                    </div>
                  </TabsContent>

                  <TabsContent value="demographics" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Demographics</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This information is used for verification and security purposes.
                      </p>
                      <DemographicsFields form={form} disabled={saving} />
                    </div>
                  </TabsContent>

                  <TabsContent value="address" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Residential Address</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your residential address is required for security verification and background checks.
                      </p>
                      <ResidentialAddressFields form={form} disabled={saving} />
                    </div>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/provider/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderAccount;
