import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition, Switch as HeadlessSwitch, Listbox } from "@headlessui/react";
import { Settings, LogOut, Key, CheckCircle, Bell, User as UserIcon, Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { banner } from "@/hooks/use-banner";
import NotificationPreferences from "@/components/NotificationPreferences";
import { cn } from "@/lib/utils";

interface SettingsDrawerProps {
  role: 'customer' | 'provider';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsDrawer = ({ role, open: controlledOpen, onOpenChange }: SettingsDrawerProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Use controlled open state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      setLoading(true);
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

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
      banner.error('Failed to load settings');
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
      banner.success('Changes saved');
    } catch (error) {
      console.error('Error:', error);
      banner.error('Failed to save changes');
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.functions.invoke('request-password-reset', {
        body: { email: profile.email }
      });

      if (error) throw error;
      banner.success('Password reset email sent! Check your inbox.');
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      banner.error('Failed to send reset email');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      banner.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      banner.error("Failed to logout");
    }
  };

  const currencyOptions = [
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'CAD', label: 'CAD ($)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'pt', label: 'Português' }
  ];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-background shadow-xl">
                    {/* Header */}
                    <div className="border-b px-4 sm:px-6 py-4 sm:py-5 shrink-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <Dialog.Title className="text-[clamp(18px,4.5vw,20px)] font-semibold text-foreground">
                            Settings
                          </Dialog.Title>
                          <Dialog.Description className="text-[clamp(12px,3vw,14px)] text-muted-foreground mt-1">
                            Manage your account settings and preferences
                          </Dialog.Description>
                        </div>
                        <button
                          type="button"
                          className="rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
                          onClick={() => setOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="relative flex-1 overflow-y-auto px-4 sm:px-6">
                      {loading ? (
                        <div className="flex items-center justify-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="space-y-4 py-4 sm:py-5">
                          {/* Account Information */}
                          <Card className="border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-primary" />
                                Account Information
                              </CardTitle>
                              <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                Your basic account details
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label htmlFor="firstName" className="text-[clamp(11px,2.5vw,13px)] font-medium">
                                    First Name
                                  </Label>
                                  <Input
                                    id="firstName"
                                    value={profile?.first_name || ''}
                                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                    onBlur={() => updateSetting('first_name', profile.first_name)}
                                    className="min-h-[44px] text-[clamp(14px,3.5vw,16px)]"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="lastName" className="text-[clamp(11px,2.5vw,13px)] font-medium">
                                    Last Name
                                  </Label>
                                  <Input
                                    id="lastName"
                                    value={profile?.last_name || ''}
                                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                    onBlur={() => updateSetting('last_name', profile.last_name)}
                                    className="min-h-[44px] text-[clamp(14px,3.5vw,16px)]"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-[clamp(11px,2.5vw,13px)] font-medium">
                                  Phone Number
                                </Label>
                                <Input
                                  id="phone"
                                  value={profile?.phone || ''}
                                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                  onBlur={() => updateSetting('phone', profile.phone)}
                                  placeholder="+351 XXX XXX XXX"
                                  className="min-h-[44px] text-[clamp(14px,3.5vw,16px)]"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[clamp(11px,2.5vw,13px)] font-medium">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  value={profile?.email || ''}
                                  disabled
                                  className="min-h-[44px] text-[clamp(14px,3.5vw,16px)] bg-muted/50"
                                />
                                <p className="text-[clamp(10px,2.5vw,12px)] text-muted-foreground">
                                  Email cannot be changed
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Provider-specific settings */}
                          {role === 'provider' && (
                            <>
                              <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Provider Settings
                                  </CardTitle>
                                  <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                    Manage your job availability
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="flex items-center justify-between gap-4 py-2">
                                    <div className="flex-1">
                                      <Label className="text-[clamp(13px,3vw,15px)] font-medium">
                                        Available for Jobs
                                      </Label>
                                      <p className="text-[clamp(11px,2.5vw,13px)] text-muted-foreground mt-0.5">
                                        Show up in search results
                                      </p>
                                    </div>
                                    <HeadlessSwitch
                                      checked={profile?.available_status || false}
                                      onChange={(checked) => updateSetting('available_status', checked)}
                                      className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center",
                                        profile?.available_status ? 'bg-primary' : 'bg-muted'
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                          profile?.available_status ? 'translate-x-6' : 'translate-x-1'
                                        )}
                                      />
                                    </HeadlessSwitch>
                                  </div>
                                  <div className="h-px bg-border/50" />
                                  <div className="flex items-center justify-between gap-4 py-2">
                                    <div className="flex-1">
                                      <Label className="text-[clamp(13px,3vw,15px)] font-medium">
                                        Accept Recurring Jobs
                                      </Label>
                                      <p className="text-[clamp(11px,2.5vw,13px)] text-muted-foreground mt-0.5">
                                        Receive scheduled bookings
                                      </p>
                                    </div>
                                    <HeadlessSwitch
                                      checked={profile?.accept_recurring || false}
                                      onChange={(checked) => updateSetting('accept_recurring', checked)}
                                      className={cn(
                                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation active:scale-95 min-w-[44px] min-h-[44px] flex items-center justify-center",
                                        profile?.accept_recurring ? 'bg-primary' : 'bg-muted'
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                          profile?.accept_recurring ? 'translate-x-6' : 'translate-x-1'
                                        )}
                                      />
                                    </HeadlessSwitch>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border-border/50">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                    Verification Status
                                  </CardTitle>
                                  <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                    Your account verification
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="p-3 bg-muted/50 rounded-lg border border-border/30">
                                    <p className="text-[clamp(11px,2.5vw,13px)] text-center text-muted-foreground">
                                      Contact support to update your verification status
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </>
                          )}

                          {/* Customer-specific settings */}
                          {role === 'customer' && (
                            <Card className="border-border/50">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold">
                                  Preferences
                                </CardTitle>
                                <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                  Your account preferences
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="space-y-1.5">
                                  <Label className="text-[clamp(11px,2.5vw,13px)] font-medium">Currency</Label>
                                  <Listbox
                                    value={profile?.currency || 'EUR'}
                                    onChange={(value) => updateSetting('currency', value)}
                                  >
                                    <div className="relative mt-1">
                                      <Listbox.Button className="relative w-full min-h-[44px] cursor-pointer rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-primary text-[clamp(14px,3.5vw,16px)]">
                                        <span className="block truncate">
                                          {currencyOptions.find(o => o.value === profile?.currency)?.label || 'EUR (€)'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </span>
                                      </Listbox.Button>
                                      <Transition
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                      >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover border border-border py-1 shadow-lg focus:outline-none">
                                          {currencyOptions.map((option) => (
                                            <Listbox.Option
                                              key={option.value}
                                              value={option.value}
                                              className={({ active }) =>
                                                cn(
                                                  "relative cursor-pointer select-none py-2 pl-10 pr-4 min-h-[44px] flex items-center text-[clamp(14px,3.5vw,16px)]",
                                                  active ? 'bg-primary/10 text-primary' : 'text-foreground'
                                                )
                                              }
                                            >
                                              {({ selected }) => (
                                                <>
                                                  <span className={cn("block truncate", selected ? 'font-medium' : 'font-normal')}>
                                                    {option.label}
                                                  </span>
                                                  {selected && (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                      <Check className="h-4 w-4" />
                                                    </span>
                                                  )}
                                                </>
                                              )}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </Transition>
                                    </div>
                                  </Listbox>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Notifications */}
                          <Card className="border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2">
                                <Bell className="h-4 w-4 text-primary" />
                                Notifications
                              </CardTitle>
                              <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                Manage notification preferences
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <NotificationPreferences role={role} />
                            </CardContent>
                          </Card>

                          {/* Language */}
                          <Card className="border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold">
                                Language
                              </CardTitle>
                              <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                Choose your preferred language
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Listbox
                                value={profile?.language || 'en'}
                                onChange={(value) => updateSetting('language', value)}
                              >
                                <div className="relative">
                                  <Listbox.Button className="relative w-full min-h-[44px] cursor-pointer rounded-md border border-input bg-background py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-primary text-[clamp(14px,3.5vw,16px)]">
                                    <span className="block truncate">
                                      {languageOptions.find(o => o.value === profile?.language)?.label || 'English'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </span>
                                  </Listbox.Button>
                                  <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover border border-border py-1 shadow-lg focus:outline-none">
                                      {languageOptions.map((option) => (
                                        <Listbox.Option
                                          key={option.value}
                                          value={option.value}
                                          className={({ active }) =>
                                            cn(
                                              "relative cursor-pointer select-none py-2 pl-10 pr-4 min-h-[44px] flex items-center text-[clamp(14px,3.5vw,16px)]",
                                              active ? 'bg-primary/10 text-primary' : 'text-foreground'
                                            )
                                          }
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span className={cn("block truncate", selected ? 'font-medium' : 'font-normal')}>
                                                {option.label}
                                              </span>
                                              {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                                  <Check className="h-4 w-4" />
                                                </span>
                                              )}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </Listbox>
                            </CardContent>
                          </Card>

                          {/* Security */}
                          <Card className="border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2">
                                <Key className="h-4 w-4 text-primary" />
                                Security
                              </CardTitle>
                              <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                Manage your account security
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePasswordReset}
                                className="w-full min-h-[44px] touch-target text-[clamp(14px,3.5vw,16px)]"
                              >
                                Reset Password
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Logout */}
                          <Card className="border-destructive/30 bg-destructive/5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-[clamp(14px,3.5vw,16px)] font-semibold flex items-center gap-2 text-destructive">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                              </CardTitle>
                              <CardDescription className="text-[clamp(11px,2.5vw,13px)]">
                                End your current session
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                                className="w-full min-h-[44px] touch-target text-[clamp(14px,3.5vw,16px)]"
                              >
                                Logout
                              </Button>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SettingsDrawer;
