import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut, Save, User, MapPin, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { ProfileFormSkeleton } from "@/components/skeletons/FormSkeleton";
import { 
  accountInfoSchema, 
  demographicsSchema, 
  addressSchema,
  AccountInfoData,
  DemographicsData,
  AddressData 
} from "@/lib/schemas/profileSchema";
import { AccountInfoFields } from "@/components/forms/AccountInfoFields";
import { DemographicsFields } from "@/components/forms/DemographicsFields";
import { ResidentialAddressFields } from "@/components/forms/ResidentialAddressFields";
import AvatarUploader from "@/components/AvatarUploader";

const CustomerAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingDemographics, setSavingDemographics] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);

  // Separate forms for each tab
  const accountForm = useForm<AccountInfoData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "Portugal",
      currency: "EUR",
      language: "en"
    }
  });

  const demographicsForm = useForm<DemographicsData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: {
      gender: "prefer_not_to_say",
      date_of_birth: "",
    }
  });

  const addressForm = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      residential_street: "",
      residential_apt_unit: "",
      residential_city: "",
      residential_province: "",
      residential_postal_code: "",
      residential_country: "Portugal",
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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data?.role !== 'customer') {
        navigate('/provider/dashboard');
        return;
      }

      setProfileData(data);

      // Reset each form separately
      accountForm.reset({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone: data.phone || "",
        country: data.country || "Portugal",
        currency: data.currency || "EUR",
        language: data.language || "en"
      });

      demographicsForm.reset({
        gender: data.gender || "prefer_not_to_say",
        date_of_birth: data.date_of_birth || "",
      });

      addressForm.reset({
        residential_street: data.residential_street || "",
        residential_apt_unit: data.residential_apt_unit || "",
        residential_city: data.residential_city || "",
        residential_province: data.residential_province || "",
        residential_postal_code: data.residential_postal_code || "",
        residential_country: (data.residential_country === "Canada" ? "Canada" : "Portugal") as "Canada" | "Portugal",
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAccount = async (values: AccountInfoData) => {
    setSavingAccount(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Account information updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update account information');
    } finally {
      setSavingAccount(false);
    }
  };

  const onSubmitDemographics = async (values: DemographicsData) => {
    setSavingDemographics(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Personal information updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update personal information');
    } finally {
      setSavingDemographics(false);
    }
  };

  const onSubmitAddress = async (values: AddressData) => {
    setSavingAddress(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', userId);

      if (error) throw error;

      toast.success('Address updated successfully');
      await loadProfile();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update address');
    } finally {
      setSavingAddress(false);
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="profile" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="demographics" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Personal</span>
            </TabsTrigger>
            <TabsTrigger value="address" className="flex-col gap-1 py-2.5 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Address</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Info Tab */}
          <TabsContent value="profile" className="mt-4">
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onSubmitAccount)}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <AccountInfoFields form={accountForm} disabled={savingAccount} />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/customer/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={savingAccount} className="gap-2">
                        <Save className="w-4 h-4" />
                        {savingAccount ? 'Saving...' : 'Save Account Info'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="mt-4">
            <Form {...demographicsForm}>
              <form onSubmit={demographicsForm.handleSubmit(onSubmitDemographics)}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This information helps us provide better services.
                    </p>
                    <DemographicsFields form={demographicsForm} disabled={savingDemographics} />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/customer/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={savingDemographics} className="gap-2">
                        <Save className="w-4 h-4" />
                        {savingDemographics ? 'Saving...' : 'Save Personal Info'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address" className="mt-4">
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(onSubmitAddress)}>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4 md:p-6 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Used for security and verification purposes.
                    </p>
                    <ResidentialAddressFields form={addressForm} disabled={savingAddress} />
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/customer/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={savingAddress} className="gap-2">
                        <Save className="w-4 h-4" />
                        {savingAddress ? 'Saving...' : 'Save Address'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerAccount;
