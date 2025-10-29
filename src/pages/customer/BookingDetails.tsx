import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button as HeroButton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, Star, Package, DollarSign, User, Home, Building2, MessageCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";
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
          provider_profiles(*, profiles(phone))
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
              {address?.property_type === 'House' ? (
                <Home className="w-5 h-5 text-primary" />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
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
                {address?.country === 'Portugal' 
                  ? `${address.rua}${address.porta_andar ? `, ${address.porta_andar}` : ''}`
                  : `${address?.street}${address?.apt_unit ? `, ${address?.apt_unit}` : ''}`
                }
              </p>
              <p className="text-xs text-gray-500 text-left">
                {address?.country === 'Portugal'
                  ? `${address.localidade}, ${address.codigo_postal}`
                  : `${address?.city}, ${address?.province} ${address?.postal_code}`
                }
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
        {provider && <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
            {/* Colored Header */}
            <div className="relative h-16 bg-gradient-to-r from-teal-500 to-teal-600">
              {/* Avatar Positioned on Header - Left Aligned */}
              <div className="absolute -bottom-10 left-4">
                <ProviderAvatarBadge
                  imageUrl={provider.photo_url}
                  isVerified={provider.verified}
                  createdAt={provider.created_at}
                  size={80}
                  alt={provider.full_name}
                />
              </div>
            </div>

            {/* Content Section - Left Aligned */}
            <CardContent className="pt-12 px-4 pb-4">
              {/* Provider Name */}
              <h3 className="text-lg font-bold text-gray-900 mb-1 text-left">
                {provider.full_name}
              </h3>

              {/* Bio/Description */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed text-left">
                {provider.bio || 'Professional cleaning services with attention to detail and quality assurance.'}
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-base font-bold text-gray-900">
                  {provider.rating_avg?.toFixed(1) || '0.0'}
                </span>
                <span className="text-sm text-gray-500">
                  ({provider.rating_count || 0} Reviews)
                </span>
              </div>


              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 text-gray-700 font-semibold touch-target"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button 
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-md touch-target"
                  onClick={() => provider?.profiles?.phone && window.open(`tel:${provider.profiles.phone}`)}
                  disabled={!provider?.profiles?.phone}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>}

        {/* Package & Pricing Card */}
        <Card className="border-2 shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <Table className="border-collapse">
              <TableHeader>
                <TableRow className="bg-accent/5 border-b-2">
                  <TableHead className="text-left font-bold text-base border-r-2 border-border" colSpan={1}>
                    <div className="flex items-center gap-2 p-2">
                      <Package className="w-5 h-5 text-accent" />
                      Package Details
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-bold" colSpan={1}></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Package Info Row */}
                <TableRow className="bg-muted/20 border-b">
                  <TableCell className="font-semibold border-r-2 border-border">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Selected Package</p>
                      <p className="text-base font-bold">{packageInfo?.package_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {packageInfo?.time_included} • {packageInfo?.bedroom_count} Bedrooms
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right align-middle">
                    <span className="text-lg font-bold text-primary">
                      {address?.currency === 'EUR' ? '€' : '$'}{packageInfo?.one_time_price}
                    </span>
                  </TableCell>
                </TableRow>

                {/* Add-ons */}
                {addons.map(addon => (
                  <TableRow key={addon.id} className="border-b">
                    <TableCell className="font-medium border-r-2 border-border">{addon.name_en}</TableCell>
                    <TableCell className="text-right">
                      {address?.currency === 'EUR' ? '€' : '$'}{Number(addon.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Subtotal */}
                <TableRow className="border-b-2 bg-muted/10">
                  <TableCell className="font-semibold border-r-2 border-border">Subtotal</TableCell>
                  <TableCell className="text-right font-semibold">
                    {address?.currency === 'EUR' ? '€' : '$'}{booking.total_estimate}
                  </TableCell>
                </TableRow>

                {/* Overtime if applicable */}
                {booking.overtime_minutes > 0 && (
                  <TableRow className="border-b">
                    <TableCell className="font-medium border-r-2 border-border">Overtime ({booking.overtime_minutes} min)</TableCell>
                    <TableCell className="text-right">
                      {address?.currency === 'EUR' ? '€' : '$'}
                      {((booking.total_final || booking.total_estimate) - booking.total_estimate).toFixed(2)}
                    </TableCell>
                  </TableRow>
                )}

                {/* Final Total */}
                <TableRow className="border-b-2 bg-primary/5">
                  <TableCell className="font-bold text-base sm:text-lg border-r-2 border-border">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Final Total
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xl sm:text-2xl text-primary">
                    {address?.currency === 'EUR' ? '€' : '$'}{booking.total_final || booking.total_estimate}
                  </TableCell>
                </TableRow>

                {/* Payment Status */}
                <TableRow className="bg-muted/5">
                  <TableCell colSpan={2} className="text-center py-4">
                    <div className={`inline-block badge ${booking.payment_status === 'paid' ? 'badge-success text-white' : 'badge-warning text-white'} border-0 shadow-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold`}>
                      Payment: {booking.payment_status.toUpperCase()}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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