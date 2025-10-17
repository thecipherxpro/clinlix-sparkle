import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button as HeroButton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, Star, Package, DollarSign, User, Home, Building2, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import AvatarDisplay from "@/components/AvatarDisplay";
import { StatusBadge } from "@/components/StatusBadge";
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

      <main className="mobile-container py-4 sm:py-6 max-w-4xl space-y-3 sm:space-y-4 pb-16">
        {/* Status Badge */}
        <div className="flex justify-center">
          <StatusBadge status={booking.job_status} />
        </div>

        {/* Property Info Card */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              {address?.property_type === 'House' ? <Home className="w-5 h-5 text-primary" /> : <Building2 className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-left">{address?.label}</CardTitle>
              <p className="text-sm text-gray-500 text-left">
                {address?.property_type} • {address?.layout_type}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Date & Time Card */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 text-left">Date & Time</h3>
              <p className="text-sm text-gray-700 text-left mt-1">
                {new Date(booking.requested_date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 text-left">
                <Clock className="w-3.5 h-3.5" />
                {booking.requested_time}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Service Location Card */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-start gap-3 p-4 sm:p-6">
            <div className="p-2 rounded-lg bg-purple-100 shrink-0">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 text-left">Service Location</h3>
              <p className="text-sm text-gray-700 text-left mt-1">
                {address?.country === 'Portugal' ? `${address.rua}${address.porta_andar ? `, ${address.porta_andar}` : ''}` : `${address?.street}${address?.apt_unit ? `, ${address?.apt_unit}` : ''}`}
              </p>
              <p className="text-xs text-gray-500 text-left">
                {address?.country === 'Portugal' ? `${address.localidade}, ${address.codigo_postal}` : `${address?.city}, ${address?.province} ${address?.postal_code}`}
              </p>
              <div className="mt-2 text-xs text-gray-500 text-left">
                Property Type: <span className="font-medium">{address?.property_type}</span>
                <br />
                Layout: <span className="font-medium">{address?.layout_type}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Provider Information Card */}
        {provider && <Card className="border-0 shadow-sm rounded-xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Avatar with Verified Badge */}
                <div className="relative shrink-0">
                  <div className="w-10h-10 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 rounded-none px-0 py-0 \nitems-start \n">
                    <AvatarDisplay userId={provider.user_id} avatarUrl={provider.photo_url} size={80} fallbackText={provider.full_name?.[0] || 'C'} />
                  </div>
                  {provider.verified && <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                      <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />
                    </div>}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Action Icons */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 text-left">
                      {provider.full_name}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <MapPin className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <Mail className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Bio/Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed text-left">
                    {provider.bio || 'Professional cleaning services with attention to detail and quality assurance for residential and commercial spaces.'}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">
                      {provider.rating_avg?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({provider.rating_count || 0} Reviews)
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="default" className="w-full bg-gray-50 hover:bg-gray-100 border-gray-200">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button size="default" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>}

        {/* Package & Pricing Card */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center gap-3 p-4 sm:p-6 pb-3">
            <div className="p-2 rounded-lg bg-accent/10 shrink-0">
              <Package className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-left">Package Details</h3>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-3">
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

            <div className="flex justify-center sm:justify-start">
              <div className={`badge ${booking.payment_status === 'paid' ? 'badge-success text-white' : 'badge-warning text-white'} border-0 shadow-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold`}>
                Payment: {booking.payment_status.toUpperCase()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {canCancel && <Card className="border-0 shadow-sm border-destructive/20 rounded-xl">
            <CardContent className="pt-6">
              <Button variant="destructive" size="lg" className="w-full" onClick={handleCancelBooking}>
                Cancel Booking
              </Button>
            </CardContent>
          </Card>}

        {booking.job_status === 'completed' && <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="pt-6 p-4 sm:p-6">
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