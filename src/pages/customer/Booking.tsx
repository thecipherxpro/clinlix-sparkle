import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin, User, Plus, CreditCard, Bath, ChefHat, Sofa, Layers, Sparkles, Square } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import MobileNav from "@/components/MobileNav";

const STEPS = [
  { id: 1, name: "Where", icon: MapPin },
  { id: 2, name: "When", icon: Calendar },
  { id: 3, name: "Who", icon: User },
  { id: 4, name: "Add-ons", icon: Plus },
  { id: 5, name: "Payment", icon: CreditCard },
  { id: 6, name: "Review", icon: Check }
];

const Booking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Data
  const [addresses, setAddresses] = useState<any[]>([]);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  
  // Booking selections
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [recurringService, setRecurringService] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  useEffect(() => {
    if (currentStep === 3 && selectedDate) {
      fetchAvailableProviders();
    }
  }, [currentStep, selectedDate]);

  const checkAuthAndFetchData = async () => {
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

      const { data: addressesData } = await supabase
        .from('customer_addresses')
        .select('*, cleaning_packages(*)')
        .eq('customer_id', user.id)
        .order('is_primary', { ascending: false });

      setAddresses(addressesData || []);

      const { data: addonsData } = await supabase
        .from('cleaning_addons')
        .select('*');

      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableProviders = async () => {
    const { data } = await supabase
      .from('provider_availability')
      .select('provider_id, provider_profiles(*)')
      .eq('date', selectedDate);

    const providers = data?.map(d => d.provider_profiles).filter(Boolean) || [];
    setAvailableProviders(providers);
  };

  const calculateTotal = () => {
    if (!selectedAddress?.cleaning_packages) return 0;
    
    const basePrice = recurringService
      ? selectedAddress.cleaning_packages.recurring_price
      : selectedAddress.cleaning_packages.one_time_price;
    
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    
    return parseFloat(basePrice) + addonsTotal;
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Please select an address');
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.error('Please select date and time');
      return;
    }
    if (currentStep === 3 && !selectedProvider) {
      toast.error('Please select a provider');
      return;
    }
    
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('bookings')
        .insert([{
          customer_id: user!.id,
          provider_id: selectedProvider.id,
          address_id: selectedAddress.id,
          package_id: selectedAddress.cleaning_packages.id,
          addon_ids: selectedAddons,
          requested_date: selectedDate,
          requested_time: selectedTime,
          total_estimate: calculateTotal(),
          status: 'pending',
          payment_status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Booking request sent! Awaiting provider confirmation.');
      navigate('/customer/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 7; hour <= 19; hour++) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return times;
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Book Service
          </h1>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b bg-card/30 backdrop-blur-sm overflow-x-auto">
        <div className="mobile-container py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto min-w-max px-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden md:block whitespace-nowrap">{step.name}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mobile-container py-4 sm:py-8 max-w-4xl">
        {/* Step 1: Where */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Where should we clean?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Select one of your saved addresses</p>
            </div>

            {addresses.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No addresses saved yet
                  </p>
                  <Button onClick={() => navigate('/customer/my-addresses')}>
                    Add Address First
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {addresses.map((address) => (
                  <Card
                    key={address.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedAddress?.id === address.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{address.label}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {address.property_type} • {address.layout_type}
                          </p>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {address.country === 'Portugal'
                          ? `${address.rua}, ${address.localidade}`
                          : `${address.street}, ${address.city}`}
                      </p>
                      {address.cleaning_packages && (
                        <div className="bg-accent/20 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-sm">
                                {address.cleaning_packages.package_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {address.cleaning_packages.time_included} included
                              </p>
                            </div>
                            <p className="font-semibold">
                              {address.currency === 'EUR' ? '€' : '$'}
                              {address.cleaning_packages.recurring_price}
                            </p>
                          </div>
                          <div className="border-t border-border/40 pt-2">
                            <p className="text-xs text-muted-foreground mb-2">Included Services:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {address.cleaning_packages.areas_included?.map((area: string, idx: number) => {
                                const getServiceIcon = (service: string) => {
                                  switch(service.toLowerCase()) {
                                    case 'bathroom': return <Bath className="w-3.5 h-3.5" />;
                                    case 'kitchen': return <ChefHat className="w-3.5 h-3.5" />;
                                    case 'livingroom': return <Sofa className="w-3.5 h-3.5" />;
                                    case 'floors': return <Layers className="w-3.5 h-3.5" />;
                                    case 'dusting': return <Sparkles className="w-3.5 h-3.5" />;
                                    case 'surfaces': return <Square className="w-3.5 h-3.5" />;
                                    default: return <Square className="w-3.5 h-3.5" />;
                                  }
                                };
                                
                                return (
                                  <div key={idx} className="flex items-center gap-1 bg-background/60 rounded px-2 py-1">
                                    <span className="text-primary">
                                      {getServiceIcon(area)}
                                    </span>
                                    <span className="text-xs capitalize">{area}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: When */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">When do you need cleaning?</h2>
              <p className="text-muted-foreground">Choose your preferred date and time</p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateDateOptions().map((date) => (
                        <SelectItem key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={recurringService}
                    onChange={(e) => setRecurringService(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="recurring" className="text-sm">
                    Make this a recurring service (save {selectedAddress?.currency === 'EUR' ? '€' : '$'}
                    {selectedAddress?.cleaning_packages && 
                      (parseFloat(selectedAddress.cleaning_packages.one_time_price) - 
                       parseFloat(selectedAddress.cleaning_packages.recurring_price)).toFixed(0)})
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Who */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose your provider</h2>
              <p className="text-muted-foreground">
                {availableProviders.length} providers available on {new Date(selectedDate).toLocaleDateString()}
              </p>
            </div>

            {availableProviders.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    No providers available for this date
                  </p>
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    Choose Different Date
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {availableProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedProvider?.id === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-primary/20">
                          <AvatarImage src={provider.photo_url} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                            {provider.full_name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{provider.full_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ⭐ {provider.rating_avg.toFixed(1)} ({provider.rating_count} reviews)
                              </p>
                            </div>
                            {selectedProvider?.id === provider.id && (
                              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          {provider.bio && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {provider.bio}
                            </p>
                          )}
                          <Button
                            variant="link"
                            size="sm"
                            className="px-0 mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/providers/profile/${provider.id}`);
                            }}
                          >
                            View Full Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Add-ons */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add extra services</h2>
              <p className="text-muted-foreground">Optional services to enhance your cleaning</p>
            </div>

            <div className="grid gap-4">
              {addons.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <Card
                    key={addon.id}
                    className={`cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedAddons(prev =>
                        prev.includes(addon.id)
                          ? prev.filter(id => id !== addon.id)
                          : [...prev, addon.id]
                      );
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{addon.name_en}</h3>
                          <p className="text-sm text-muted-foreground">{addon.name_pt}</p>
                          <Badge variant="outline" className="mt-2">
                            {addon.type === 'flat' ? 'Fixed price' : 'Per room'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">
                            +{selectedAddress?.currency === 'EUR' ? '€' : '$'}{addon.price}
                          </p>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleNext}
            >
              Skip Add-ons
            </Button>
          </div>
        )}

        {/* Step 5: Payment */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <p className="text-muted-foreground">
                Payment will be charged after provider confirms booking
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground mb-4">
                    Stripe payment integration coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For now, you can proceed with the booking request
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Review */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Your Booking</h2>
              <p className="text-muted-foreground">Please confirm all details before submitting</p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedAddress?.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAddress?.property_type} • {selectedAddress?.layout_type}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })} at {selectedTime}
                  </p>
                  {recurringService && (
                    <Badge variant="secondary" className="mt-1">Recurring Service</Badge>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provider</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedProvider?.photo_url} />
                      <AvatarFallback>
                        {selectedProvider?.full_name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedProvider?.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ⭐ {selectedProvider?.rating_avg.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Pricing</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedAddress?.cleaning_packages?.package_name}</span>
                      <span>
                        {selectedAddress?.currency === 'EUR' ? '€' : '$'}
                        {recurringService
                          ? selectedAddress?.cleaning_packages?.recurring_price
                          : selectedAddress?.cleaning_packages?.one_time_price}
                      </span>
                    </div>
                    {selectedAddons.map(addonId => {
                      const addon = addons.find(a => a.id === addonId);
                      return (
                        <div key={addonId} className="flex justify-between text-sm text-muted-foreground">
                          <span>{addon?.name_en}</span>
                          <span>
                            +{selectedAddress?.currency === 'EUR' ? '€' : '$'}{addon?.price}
                          </span>
                        </div>
                      );
                    })}
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>
                        {selectedAddress?.currency === 'EUR' ? '€' : '$'}
                        {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-accent/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> This is a booking request. Your payment will only be charged
                    after the provider confirms your booking.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1 h-12 sm:h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12 sm:h-10">
            {currentStep === 6 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Confirm Booking</span>
                <span className="sm:hidden">Confirm</span>
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Booking;
