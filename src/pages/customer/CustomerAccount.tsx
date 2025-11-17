import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut, Save, User, MapPin, UserCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { ProfileFormSkeleton } from "@/components/skeletons/FormSkeleton";
import { profileSchema, ProfileFormData } from "@/lib/schemas/profileSchema";
import { AccountInfoFields } from "@/components/forms/AccountInfoFields";
import { DemographicsFields } from "@/components/forms/DemographicsFields";
import { ResidentialAddressFields } from "@/components/forms/ResidentialAddressFields";
import AvatarUploader from "@/components/AvatarUploader";

const CustomerAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string>("");

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

      if (profileData?.role !== 'customer') {
        navigate('/provider/dashboard');
        return;
      }

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
        residential_country: profileData.residential_country || "Portugal",
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
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', userId);

      if (error) throw error;

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
            onClick={() => navigate('/customer/dashboard')}
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
                  Manage your profile information and settings
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <AvatarUploader role="customer" editable={true} />
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
                        This information helps us provide better services and is kept secure.
                      </p>
                      <DemographicsFields form={form} disabled={saving} />
                    </div>
                  </TabsContent>

                  <TabsContent value="address" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Residential Address</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your residential address is separate from your service addresses and is used for security purposes.
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
                    onClick={() => navigate('/customer/dashboard')}
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

export default CustomerAccount;
