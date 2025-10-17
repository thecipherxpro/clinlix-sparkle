import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button as HeroButton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, Star, Package, DollarSign, User } from "lucide-react";
import { toast } from "sonner";
import AvatarDisplay from "@/components/AvatarDisplay";
const STATUS_COLORS = {
  pending: "bg-yellow-500",
  confirmed: "bg-blue-500",
  on_the_way: "bg-purple-500",
  arrived: "bg-indigo-500",
  started: "bg-green-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500"
};
const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  on_the_way: "On the Way",
  arrived: "Arrived",
  started: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled"
};
const BookingDetails = () => {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchBookingDetails();
  }, [id]);
  const fetchBookingDetails = async () => {
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
      const {
        data: bookingData,
        error
      } = await supabase.from('bookings').select(`
          *,
          customer_addresses(*, cleaning_packages(*)),
          provider_profiles(*)
        `).eq('id', id).single();
      if (error) throw error;

      // Verify this booking belongs to the current user
      if (bookingData.customer_id !== user.id) {
        toast.error('Unauthorized access');
        navigate('/customer/bookings');
        return;
      }
      setBooking(bookingData);

      // Fetch addon details if any
      if (bookingData.addon_ids && bookingData.addon_ids.length > 0) {
        const {
          data: addonsData,
          error: addonsError
        } = await supabase.from('cleaning_addons').select('*').in('id', bookingData.addon_ids);
        if (addonsError) {
          console.error('Error fetching addons:', addonsError);
        } else {
          setAddons(addonsData || []);
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to load booking details');
      navigate('/customer/bookings');
    } finally {
      setLoading(false);
    }
  };
  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const {
        error
      } = await supabase.from('bookings').update({
        job_status: 'cancelled'
      }).eq('id', id);
      if (error) throw error;
      toast.success('Booking cancelled');
      fetchBookingDetails();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!booking) return null;
  const canCancel = ['pending', 'confirmed'].includes(booking.job_status);
  const address = booking.customer_addresses;
  const provider = booking.provider_profiles;
  const packageInfo = address?.cleaning_packages;
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-6">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <HeroButton isIconOnly variant="light" onPress={() => navigate('/customer/bookings')} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </HeroButton>
          <h1 className="text-lg sm:text-xl font-bold text-left">Booking Details</h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-6">
        {/* Status Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="space-y-3">
            <div className={`badge ${STATUS_COLORS[booking.job_status as keyof typeof STATUS_COLORS]} w-fit`}>
              {STATUS_LABELS[booking.job_status as keyof typeof STATUS_LABELS]}
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl text-left">{address?.label}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1.5 text-left">
                {address?.property_type} • {address?.layout_type}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Date & Time Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base text-left">
                  {new Date(booking.requested_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1.5 text-left">
                  <Clock className="w-3.5 h-3.5" />
                  {booking.requested_time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Service Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-medium text-sm sm:text-base text-left">{address?.label}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed text-left">
                {address?.country === 'Portugal' ? <>
                    {address.rua}, {address.porta_andar && `${address.porta_andar}, `}
                    {address.localidade}, {address.codigo_postal}
                  </> : <>
                    {address?.street}, {address?.apt_unit && `${address?.apt_unit}, `}
                    {address?.city}, {address?.province} {address?.postal_code}
                  </>}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm text-left">
              <div>
                <p className="text-muted-foreground mb-1 text-left">Property Type</p>
                <p className="font-medium text-left">{address?.property_type}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 text-left">Layout</p>
                <p className="font-medium text-left">{address?.layout_type}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Card */}
        {provider && <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-start gap-2 text-left">
                <User className="w-5 h-5 text-primary" />
                Provider Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <AvatarDisplay userId={provider.user_id} avatarUrl={provider.photo_url} size={48} fallbackText={provider.full_name.split(' ').map((n: string) => n[0]).join('')} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-left">{provider.full_name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-1 text-left">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    {provider.rating_avg.toFixed(1)} ({provider.rating_count} reviews)
                  </p>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" onClick={() => navigate(`/providers/profile/${provider.id}`)}>
                  View
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Provider
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Provider
                </Button>
              </div>
            </CardContent>
          </Card>}

        {/* Package & Pricing Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 text-left">Selected Package</p>
              <p className="font-semibold text-base sm:text-lg text-left">{packageInfo?.package_name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 text-left">
                {packageInfo?.time_included} • {packageInfo?.bedroom_count} Bedrooms
              </p>
            </div>

            {addons.length > 0 && <>
                <Separator />
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2.5 text-left">Add-ons</p>
                  <div className="space-y-2.5">
                    {addons.map(addon => <div key={addon.id} className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-foreground text-left">{addon.name_en}</span>
                        <span className="font-medium text-foreground text-right">
                          {address?.currency === 'EUR' ? '€' : '$'}{Number(addon.price).toFixed(2)}
                        </span>
                      </div>)}
                  </div>
                </div>
              </>}

            <Separator />

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground text-left">Package Price</span>
                <span className="font-medium text-foreground text-right">
                  {address?.currency === 'EUR' ? '€' : '$'}{packageInfo?.one_time_price}
                </span>
              </div>
              {addons.length > 0 && <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground text-left">Add-ons Total</span>
                  <span className="font-medium text-foreground text-right">
                    {address?.currency === 'EUR' ? '€' : '$'}
                    {addons.reduce((sum, addon) => sum + Number(addon.price), 0).toFixed(2)}
                  </span>
                </div>}
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground text-left">Subtotal</span>
                <span className="font-medium text-foreground text-right">
                  {address?.currency === 'EUR' ? '€' : '$'}{booking.total_estimate}
                </span>
              </div>
              {booking.overtime_minutes > 0 && <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground text-left">Overtime ({booking.overtime_minutes} min)</span>
                  <span className="font-medium text-foreground text-right">
                    {address?.currency === 'EUR' ? '€' : '$'}
                    {((booking.total_final || booking.total_estimate) - booking.total_estimate).toFixed(2)}
                  </span>
                </div>}
              <Separator className="my-3" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-semibold text-base sm:text-lg flex items-center gap-2 text-left">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Final Total
                </span>
                <span className="font-bold text-xl sm:text-2xl text-primary text-right">
                  {address?.currency === 'EUR' ? '€' : '$'}{booking.total_final || booking.total_estimate}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <div className={`badge ${booking.payment_status === 'paid' ? 'badge-primary' : 'badge-secondary'} text-xs`}>
                Payment: {booking.payment_status.toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {canCancel && <Card className="border-0 shadow-sm border-destructive/20">
            <CardContent className="pt-6">
              <Button variant="destructive" size="lg" className="w-full" onClick={handleCancelBooking}>
                Cancel Booking
              </Button>
            </CardContent>
          </Card>}

        {booking.job_status === 'completed' && <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <Button variant="outline" size="lg" className="w-full" onClick={() => navigate(`/customer/bookings/${booking.id}/review`)}>
                <Star className="w-4 h-4 mr-2" />
                Leave a Review
              </Button>
            </CardContent>
          </Card>}
      </main>
    </div>;
};
export default BookingDetails;