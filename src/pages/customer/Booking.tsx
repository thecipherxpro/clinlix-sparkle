import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon, MapPin, User, Plus, CreditCard, Bath, ChefHat, Sofa, Layers, Sparkles, Square, Home, Mail, Phone, ChevronLeft, ChevronRight, Building2, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";
import ProviderCard from "@/components/ProviderCard";
import { checkUserRole } from "@/lib/roleUtils";
import { useI18n } from "@/contexts/I18nContext";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from '@/components/booking/StripePaymentForm';
const STEPS = [{
  id: 1,
  name: "Where",
  icon: MapPin
}, {
  id: 2,
  name: "When",
  icon: CalendarIcon
}, {
  id: 3,
  name: "Who",
  icon: User
}, {
  id: 4,
  name: "Add-ons",
  icon: Plus
}, {
  id: 5,
  name: "Payment",
  icon: CreditCard
}, {
  id: 6,
  name: "Review",
  icon: Check
}];
const Booking = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Data
  const [addresses, setAddresses] = useState<any[]>([]);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);

  // Booking selections
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [recurringService, setRecurringService] = useState(false);
  
  // Payment state
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  useEffect(() => {
    checkAuthAndFetchData();
    // Initialize Stripe
    initializeStripe();
  }, []);
  
  useEffect(() => {
    if (currentStep === 3 && selectedDate) {
      fetchAvailableProviders();
    }
  }, [currentStep, selectedDate]);
  
  useEffect(() => {
    if (currentStep === 5 && !clientSecret && !paymentProcessing) {
      createPaymentIntent();
    }
  }, [currentStep]);
  
  const initializeStripe = async () => {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (publishableKey) {
      const stripe = await loadStripe(publishableKey);
      setStripePromise(stripe);
    }
  };
  
  const createPaymentIntent = async () => {
    if (!selectedAddress || paymentProcessing) return;
    
    setPaymentProcessing(true);
    try {
      const total = calculateTotal();
      const currency = selectedAddress.currency;
      
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount: total,
          currency: currency,
          metadata: {
            addressId: selectedAddress.id,
            providerId: selectedProvider?.id,
            packageId: selectedAddress.cleaning_packages?.id,
          }
        }
      });
      
      if (error) throw error;
      
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
      setCurrentStep(4); // Go back to add-ons step
    } finally {
      setPaymentProcessing(false);
    }
  };
  
  const handlePaymentSuccess = (intentId: string) => {
    setPaymentIntentId(intentId);
    setCurrentStep(6); // Move to review step
  };
  const checkAuthAndFetchData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      
      // Use secure role check from user_roles table
      const isCustomer = await checkUserRole(user.id, 'customer');
      if (!isCustomer) {
        navigate('/provider/dashboard');
        return;
      }
      const {
        data: addressesData
      } = await supabase.from('customer_addresses').select('*, cleaning_packages(*)').eq('customer_id', user.id).order('is_primary', {
        ascending: false
      });
      setAddresses(addressesData || []);
      const {
        data: addonsData
      } = await supabase.from('cleaning_addons').select('*');
      setAddons(addonsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchAvailableProviders = async () => {
    if (!selectedDate) return;
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const {
      data
    } = await supabase.from('provider_availability').select(`
        provider_id, 
        provider_profiles(
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        )
      `).eq('date', dateString);
    const providers = data?.map(d => d.provider_profiles).filter(Boolean) || [];
    setAvailableProviders(providers);
  };
  const calculateTotal = () => {
    if (!selectedAddress?.cleaning_packages) return 0;
    const basePrice = recurringService ? selectedAddress.cleaning_packages.recurring_price : selectedAddress.cleaning_packages.one_time_price;
    const addonsTotal = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return parseFloat(basePrice) + addonsTotal;
  };
  const handleNext = () => {
    if (currentStep === 1 && !selectedAddress) {
      toast.error('Choose an address to continue');
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      toast.error('Pick a date and time to see available providers');
      return;
    }
    if (currentStep === 3 && !selectedProvider) {
      toast.error('Choose a provider to continue booking');
      return;
    }
    if (currentStep === 5) {
      // Payment handled by StripePaymentForm component
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
    if (!paymentIntentId) {
      toast.error('Payment required to complete booking');
      setCurrentStep(5); // Go back to payment
      return;
    }
    
    try {
      const {
        data: {
          user
        },
        error: userError
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error('Please log in to continue');
        navigate('/auth');
        return;
      }

      const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

      // Call secure edge function for booking creation
      const { data, error } = await supabase.functions.invoke('create-booking', {
        body: {
          customerId: user.id,
          providerId: selectedProvider.id,
          addressId: selectedAddress.id,
          packageId: selectedAddress.cleaning_packages.id,
          addonIds: selectedAddons,
          requestedDate: dateString,
          requestedTime: selectedTime,
          recurringService: recurringService,
          paymentIntentId: paymentIntentId
        }
      });

      if (error) throw error;
      
      const bookingData = data.booking;

      // Get customer profile data
      const {
        data: customerProfile
      } = await supabase.from('profiles').select('first_name, last_name, email, currency').eq('id', user!.id).single();

      // Get provider profile data from the joined data
      const providerProfile = selectedProvider.profiles;

      // Format address
      const formattedAddress = selectedAddress.country === 'Portugal' ? `${selectedAddress.rua}, ${selectedAddress.localidade}, ${selectedAddress.country}` : `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.country}`;

      // Format date
      const formattedDate = selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '';
      const currency = customerProfile?.currency === 'EUR' ? '€' : '$';

      // Send booking confirmation email to customer
      supabase.functions.invoke('send-booking-confirmation', {
        body: {
          customerEmail: customerProfile?.email,
          customerName: `${customerProfile?.first_name} ${customerProfile?.last_name}`,
          bookingId: bookingData.id,
          serviceDate: formattedDate,
          serviceTime: selectedTime,
          packageName: selectedAddress.cleaning_packages.package_name,
          address: formattedAddress,
          totalAmount: calculateTotal().toFixed(2),
          currency: currency
        }
      }).catch(err => console.error('Error sending customer email:', err));

      // Send job request email to provider
      const providerEarnings = (calculateTotal() * 0.7).toFixed(2); // 70% to provider
      supabase.functions.invoke('send-job-request', {
        body: {
          providerEmail: providerProfile?.email,
          providerName: `${providerProfile?.first_name} ${providerProfile?.last_name}`,
          bookingId: bookingData.id,
          customerName: `${customerProfile?.first_name} ${customerProfile?.last_name}`,
          serviceDate: formattedDate,
          serviceTime: selectedTime,
          packageName: selectedAddress.cleaning_packages.package_name,
          address: formattedAddress,
          estimatedEarnings: providerEarnings,
          currency: currency,
          acceptUrl: `https://clinlix.com/provider/jobs`
        }
      }).catch(err => console.error('Error sending provider email:', err));
      toast.success("Booking sent! We'll notify you when your provider confirms.");
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
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour;
      times.push({
        value: `${hour.toString().padStart(2, '0')}:00`,
        display: `${displayHour}:00 ${period}`
      });
      times.push({
        value: `${hour.toString().padStart(2, '0')}:30`,
        display: `${displayHour}:30 ${period}`
      });
    }
    return times;
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
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
      <div className="border-b bg-card/30 backdrop-blur-sm overflow-x-auto hide-scrollbar">
        <div className="mobile-container py-3 sm:py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto min-w-max px-2">
            {STEPS.map((step, idx) => <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {currentStep > step.id ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <span className="text-xs mt-1 hidden md:block whitespace-nowrap">{step.name}</span>
                </div>
                {idx < STEPS.length - 1 && <div className={`w-8 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-secondary'}`} />}
              </div>)}
          </div>
        </div>
      </div>

      <main className="mobile-container py-4 sm:py-8 max-w-4xl">
        {/* Step 1: Where */}
        {currentStep === 1 && <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Which location should we clean?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Choose from your saved addresses</p>
            </div>

            {addresses.length === 0 ? <Card className="border-0 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Add your first cleaning location
                  </p>
                  <Button onClick={() => navigate('/customer/my-addresses')}>
                    Add Your First Address
                  </Button>
                </CardContent>
              </Card> : <div className="grid gap-4">
                {addresses.map(address => <Card key={address.id} className={`cursor-pointer transition-all duration-200 overflow-hidden ${selectedAddress?.id === address.id ? 'border-2 border-primary shadow-md' : 'border shadow-sm hover:shadow-md'}`} onClick={() => setSelectedAddress(address)}>
                      <CardHeader className="p-4 pb-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              {address.property_type === 'House' ? <Home className="w-6 h-6 text-primary" /> : <Building2 className="w-6 h-6 text-primary" />}
                            </div>
                            {address.is_primary && <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Star className="w-2.5 h-2.5 text-yellow-900 fill-yellow-900" />
                              </div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <CardTitle className="text-base font-semibold truncate">{address.label}</CardTitle>
                              {address.is_primary && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                  Primary
                                </span>}
                              {selectedAddress?.id === address.id && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                </div>}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {address.first_name} {address.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {address.property_type} • {address.layout_type}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 space-y-3">
                        {/* Address Section */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-muted-foreground mb-1">ADDRESS</p>
                              <p className="text-sm leading-relaxed break-words">
                                {address.country === 'Portugal' ? <>
                                    {address.rua}
                                    {address.porta_andar && <>, {address.porta_andar}</>}
                                    <br />
                                    {address.codigo_postal} {address.localidade}
                                    <br />
                                    {address.distrito}, {address.country} 🇵🇹
                                  </> : <>
                                    {address.street}
                                    {address.apt_unit && <>, {address.apt_unit}</>}
                                    <br />
                                    {address.city}, {address.province}
                                    <br />
                                    {address.postal_code}, {address.country} 🇨🇦
                                  </>}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Package Section */}
                        {address.cleaning_packages && <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                            <div className="space-y-3 mb-3">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">PACKAGE</p>
                                <p className="font-semibold text-sm">{address.cleaning_packages.package_name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {address.cleaning_packages.time_included} included
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                                    {address.currency === 'EUR' ? '€' : '$'}
                                    {address.cleaning_packages.one_time_price}
                                  </p>
                                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground -mt-0.5">one-time</p>
                                </div>
                                <div>
                                  <p className="text-base sm:text-lg font-semibold text-muted-foreground">
                                    {address.currency === 'EUR' ? '€' : '$'}
                                    {address.cleaning_packages.recurring_price}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-muted-foreground/70">recurring</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Services Grid */}
                            <div className="pt-3 border-t border-border/50">
                              <p className="text-xs font-medium text-muted-foreground mb-2">SERVICES</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {address.cleaning_packages.areas_included?.map((area: string, idx: number) => {
                      const getServiceIcon = (service: string) => {
                        switch (service.toLowerCase()) {
                          case 'bathroom':
                            return <Bath className="w-3.5 h-3.5" />;
                          case 'kitchen':
                            return <ChefHat className="w-3.5 h-3.5" />;
                          case 'livingroom':
                            return <Sofa className="w-3.5 h-3.5" />;
                          case 'floors':
                            return <Layers className="w-3.5 h-3.5" />;
                          case 'dusting':
                            return <Sparkles className="w-3.5 h-3.5" />;
                          case 'surfaces':
                            return <Square className="w-3.5 h-3.5" />;
                          default:
                            return <Square className="w-3.5 h-3.5" />;
                        }
                      };
                      return <div key={idx} className="flex items-center gap-1.5 bg-background rounded-md p-2 min-w-0">
                                      <span className="text-primary flex-shrink-0">
                                        {getServiceIcon(area)}
                                      </span>
                                      <span className="text-xs capitalize leading-tight break-words">{area}</span>
                                    </div>;
                    })}
                              </div>
                            </div>
                          </div>}

                        {/* Contact Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5 min-w-0">
                            <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="text-xs break-all leading-tight">{address.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2.5 min-w-0">
                            <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="text-xs break-all leading-tight">{address.email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
              </div>}
          </div>}

        {/* Step 2: When */}
        {currentStep === 2 && <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">When do you need us?</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Pick your preferred date and time</p>
            </div>

            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
                {/* Calendar */}
                <div className="flex justify-center -mx-2 sm:mx-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} className="rounded-md border-0 scale-90 sm:scale-100 origin-top" classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-3 sm:space-y-4",
                caption: "flex justify-center pt-1 relative items-center mb-3 sm:mb-4",
                caption_label: "text-base sm:text-xl font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 sm:h-10 sm:w-10 bg-transparent hover:bg-muted rounded-md flex items-center justify-center touch-target",
                nav_button_previous: "absolute left-0 sm:left-1",
                nav_button_next: "absolute right-0 sm:right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-between mb-1 sm:mb-2",
                head_cell: "text-muted-foreground rounded-md w-9 sm:w-12 font-normal text-xs sm:text-sm uppercase",
                row: "flex w-full mt-1 sm:mt-2 justify-between",
                cell: "relative p-0 text-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent",
                day: "h-9 w-9 sm:h-12 sm:w-12 p-0 font-semibold text-sm sm:text-lg hover:bg-muted rounded-full flex items-center justify-center touch-target",
                day_selected: "bg-gradient-to-br from-[#FF6B35] to-[#F7931E] text-white hover:bg-gradient-to-br hover:from-[#FF6B35] hover:to-[#F7931E]",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground/40 opacity-50",
                day_disabled: "text-muted-foreground/30 line-through",
                day_hidden: "invisible"
              }} />
                </div>

                {/* Time Slots */}
                {selectedDate && <div className="space-y-2 sm:space-y-3">
                    <label className="text-sm font-medium block">Select Time</label>
                    <div className="relative">
                      <div className="overflow-x-auto pb-2 hide-scrollbar mx-0 my-0 px-0 py-0">
                        <div className="flex gap-2 sm:gap-3 min-w-max mx-0 my-[12px]">
                          {generateTimeOptions().map(time => <button key={time.value} onClick={() => setSelectedTime(time.value)} className={`
                                px-4 py-2.5 sm:px-6 sm:py-3 rounded-full font-medium text-sm sm:text-base whitespace-nowrap transition-all touch-target
                                ${selectedTime === time.value ? 'bg-gradient-to-br from-[#FF6B35] to-[#F7931E] text-white shadow-lg scale-105' : 'bg-muted/50 hover:bg-muted text-foreground'}
                              `}>
                              {time.display}
                            </button>)}
                        </div>
                      </div>
                    </div>
                  </div>}

                {/* Recurring Service */}
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="recurring" checked={recurringService} onChange={e => setRecurringService(e.target.checked)} className="w-4 h-4" />
                  <label htmlFor="recurring" className="text-sm">
                    Make this a recurring service (save {selectedAddress?.currency === 'EUR' ? '€' : '$'}
                    {selectedAddress?.cleaning_packages && (parseFloat(selectedAddress.cleaning_packages.one_time_price) - parseFloat(selectedAddress.cleaning_packages.recurring_price)).toFixed(0)})
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* Step 3: Who */}
        {currentStep === 3 && <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Choose your provider</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {availableProviders.length} provider{availableProviders.length !== 1 ? 's' : ''} available on {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>

            {availableProviders.length === 0 ? <Card className="border-0 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    No matches for this date
                  </p>
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="touch-target">
                    Choose Different Date
                  </Button>
                </CardContent>
              </Card> : <div className="space-y-4">
                {availableProviders.map(provider => <ProviderCard key={provider.id} providerId={provider.id} userId={provider.user_id} fullName={provider.full_name} photoUrl={provider.photo_url} verified={provider.verified} newProvider={provider.new_provider} ratingAvg={provider.rating_avg || 0} ratingCount={provider.rating_count || 0} serviceAreas={provider.service_areas || []} skills={provider.skills || []} bio={provider.bio} showActions={true} onSelect={() => setSelectedProvider(provider)} isSelected={selectedProvider?.id === provider.id} />)}
              </div>}

            {availableProviders.length > 0 && <div className="text-center pt-4">
                <Button variant="link" onClick={() => navigate('/customer/find-providers')} className="text-primary">
                  View All Providers →
                </Button>
              </div>}
          </div>}

        {/* Step 4: Add-ons */}
        {currentStep === 4 && <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add extra services</h2>
              <p className="text-muted-foreground">Optional services to enhance your cleaning</p>
            </div>

            <div className="grid gap-4">
              {addons.map(addon => {
            const isSelected = selectedAddons.includes(addon.id);
            return <Card key={addon.id} className={`cursor-pointer transition-all border-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-primary/50'}`} onClick={() => {
              setSelectedAddons(prev => prev.includes(addon.id) ? prev.filter(id => id !== addon.id) : [...prev, addon.id]);
            }}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{addon.name_en}</h3>
                          <p className="text-sm text-muted-foreground">{addon.name_pt}</p>
                          <div className="badge badge-outline mt-2">
                            {addon.type === 'flat' ? t.ui.flatPrice : t.ui.perRoom}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">
                            +{selectedAddress?.currency === 'EUR' ? '€' : '$'}{addon.price}
                          </p>
                          {isSelected && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>;
          })}
            </div>

            <Button variant="outline" className="w-full" onClick={handleNext}>
              Skip Add-ons
            </Button>
          </div>}

        {/* Step 5: Payment */}
        {currentStep === 5 && <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Payment Information</h2>
              <p className="text-muted-foreground">
                Secure payment processing via Stripe
              </p>
            </div>

            {paymentProcessing && (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Initializing payment...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!paymentProcessing && clientSecret && stripePromise && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm 
                  onSuccess={handlePaymentSuccess}
                  onBack={handleBack}
                  amount={calculateTotal()}
                  currency={selectedAddress?.currency || 'EUR'}
                />
              </Elements>
            )}
          </div>}

        {/* Step 6: Review */}
        {currentStep === 6 && <div className="space-y-6">
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
                  {recurringService && <div className="badge badge-secondary mt-1">{t.ui.recurringService}</div>}
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Provider</p>
                  <div className="flex items-center gap-3 mt-2">
                    <ProviderAvatarBadge imageUrl={selectedProvider?.photo_url} isVerified={selectedProvider?.verified} createdAt={selectedProvider?.created_at} size={40} alt={selectedProvider?.full_name} />
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
                        {recurringService ? selectedAddress?.cleaning_packages?.recurring_price : selectedAddress?.cleaning_packages?.one_time_price}
                      </span>
                    </div>
                    {selectedAddons.map(addonId => {
                  const addon = addons.find(a => a.id === addonId);
                  return <div key={addonId} className="flex justify-between text-sm text-muted-foreground">
                          <span>{addon?.name_en}</span>
                          <span>
                            +{selectedAddress?.currency === 'EUR' ? '€' : '$'}{addon?.price}
                          </span>
                        </div>;
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
          </div>}

        {/* Navigation Buttons */}
        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          {currentStep > 1 && <Button variant="outline" onClick={handleBack} className="flex-1 h-12 sm:h-10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>}
          <Button onClick={handleNext} className="flex-1 h-12 sm:h-10">
            {currentStep === 6 ? <>
                <Check className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Confirm Booking</span>
                <span className="sm:hidden">Confirm</span>
              </> : <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>}
          </Button>
        </div>
      </main>
    </div>;
};
export default Booking;