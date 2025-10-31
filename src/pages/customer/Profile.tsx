import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogOut, Save, User, Settings, Shield, Phone, Mail } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/base/avatar/avatar";
import { useI18n } from "@/contexts/I18nContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const profileFormSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().optional(),
  email: z.string().email(),
  country: z.string(),
  currency: z.string(),
  avatar_url: z.string().optional()
});

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "Portugal",
      currency: "EUR",
      avatar_url: ""
    }
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
      form.reset({
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

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          country: values.country,
          currency: values.currency,
          avatar_url: values.avatar_url
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success(t.settings.changesSaved);
      checkAuthAndFetchProfile();
    } catch (error: any) {
      toast.error(error.message || t.errors.updateFailed);
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

  const formValues = form.watch();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10">
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
            <h1 className="text-2xl font-bold tracking-tight">{t.common.profile}</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Header Card */}
        <Card className="border-none shadow-sm">
          <CardContent className="pt-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar
                src={formValues.avatar_url}
                alt={`${formValues.first_name} ${formValues.last_name}`}
                size="4xl"
                fallback={`${formValues.first_name?.[0] || ''}${formValues.last_name?.[0] || ''}`}
              />
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {formValues.first_name} {formValues.last_name}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <p className="text-base">{formValues.email}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  <User className="w-4 h-4" />
                  {t.common.customer}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid h-11 bg-muted/50">
            <TabsTrigger value="personal" className="gap-2 data-[state=active]:bg-background">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal Info</span>
              <span className="sm:hidden">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-background">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6 mt-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.common.firstName}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-12 border-border/60 focus-visible:ring-1"
                                placeholder="Enter your first name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">{t.common.lastName}</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="h-12 border-border/60 focus-visible:ring-1"
                                placeholder="Enter your last name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">{t.common.email}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input 
                                {...field} 
                                type="email"
                                disabled
                                className="h-12 pl-11 border-border/60 bg-muted/30"
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            {t.settings.emailCannotChange}
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">{t.common.phone}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input 
                                {...field} 
                                placeholder="+351 XXX XXX XXX"
                                className="h-12 pl-11 border-border/60 focus-visible:ring-1"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-6" />

                    <div className="flex justify-end pt-2">
                      <Button 
                        type="submit" 
                        size="lg" 
                        disabled={form.formState.isSubmitting}
                        className="h-12 px-8 font-medium"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {form.formState.isSubmitting ? t.common.saving : t.common.saveChanges}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Regional Settings</CardTitle>
                <CardDescription>Manage your location and currency preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">{t.common.country}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="h-12 border-border/60 bg-muted/30"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          {t.settings.countryCannotChange}
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">{t.common.currency}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled
                            className="h-12 border-border/60 bg-muted/30"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <FormLabel className="text-sm font-medium">{t.settings.language}</FormLabel>
                  <LanguageSwitcher />
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2 text-xl">
                  <Shield className="w-5 h-5" />
                  Account Actions
                </CardTitle>
                <CardDescription>Manage your account security and session</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full h-12 font-medium"
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
