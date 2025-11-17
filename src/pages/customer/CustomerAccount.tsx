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
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3 md:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/customer/dashboard')}
            className="gap-1.5 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <AvatarUploader role="customer" editable={true} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile information
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1">
                <TabsTrigger value="profile" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="demographics" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Demographics</span>
                  <span className="sm:hidden">Demo</span>
                </TabsTrigger>
                <TabsTrigger value="address" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Address</span>
                </TabsTrigger>
              </TabsList>

              <Card className="mt-4 border-0 shadow-sm">
                <CardContent className="p-4 md:p-6">
                  <TabsContent value="profile" className="mt-0 space-y-4">
                    <AccountInfoFields form={form} disabled={saving} />
                  </TabsContent>

                  <TabsContent value="demographics" className="mt-0 space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      This information helps us provide better services.
                    </p>
                    <DemographicsFields form={form} disabled={saving} />
                  </TabsContent>

                  <TabsContent value="address" className="mt-0 space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Used for security and verification purposes.
                    </p>
                    <ResidentialAddressFields form={form} disabled={saving} />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>

            <div className="sticky bottom-0 bg-background border-t border-border -mx-4 px-4 py-3 md:mx-0 md:border-0 md:px-0">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/customer/dashboard')}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="w-full sm:w-auto order-1 sm:order-2 gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CustomerAccount;
