import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, XCircle, Star, RotateCcw, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { StatusStepper } from "@/components/booking/StatusStepper";
import { PersonCard } from "@/components/booking/PersonCard";
import { LocationCard } from "@/components/booking/LocationCard";
import { ServiceDetailsCard } from "@/components/booking/ServiceDetailsCard";
import { CancellationDialog } from "@/components/booking/CancellationDialog";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { DetailCardSkeletonList } from "@/components/skeletons/DetailCardSkeleton";
import { StickyPageHeader } from "@/components/StickyPageHeader";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
    
    // Set up real-time updates
    const channel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log('Booking updated:', payload);
          fetchBookingDetails();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer_addresses(*, cleaning_packages(*)),
          provider_profiles(*, profiles(phone))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (bookingData.customer_id !== user.id) {
        toast.error('Unauthorized access');
        navigate('/customer/bookings');
        return;
      }

      setBooking(bookingData);

      if (bookingData.addon_ids && bookingData.addon_ids.length > 0) {
        const { data: addonsData, error: addonsError } = await supabase
          .from('cleaning_addons')
          .select('*')
          .in('id', bookingData.addon_ids);

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

  const handleMessage = () => {
    setChatOpen(true);
  };

  const handleReassign = () => {
    navigate(`/customer/find-providers?bookingId=${id}`);
  };

  const handleReview = () => {
    // TODO: Implement review modal
    toast.info('Review feature coming soon');
  };

  const handleNavigate = () => {
    if (!booking?.customer_addresses) return;
    
    const address = booking.customer_addresses;
    const street = address.street || address.rua;
    const city = address.city || address.localidade;
    const postal = address.postal_code || address.codigo_postal;
    const fullAddress = [street, city, postal].filter(Boolean).join(", ");
    const encodedAddress = encodeURIComponent(fullAddress);
    
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <StickyPageHeader title="Booking Details" />
        <main className="container max-w-4xl py-4 space-y-4">
          <DetailCardSkeletonList count={4} />
        </main>
      </div>
    );
  }

  if (!booking) return null;

  const canCancel = ['pending', 'confirmed'].includes(booking.job_status);
  const canMessage = booking.provider_id && !['cancelled', 'declined'].includes(booking.job_status);
  const canReview = booking.job_status === 'completed' && !booking.has_review;
  const isDeclined = booking.job_status === 'declined';
  const address = booking.customer_addresses;
  const provider = booking.provider_profiles;
  const packageInfo = address?.cleaning_packages;
  const currency = address?.currency || "EUR";

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; variant: "secondary" | "default" | "destructive" | "outline" }> = {
      pending: { label: "⏳ Awaiting Confirmation", variant: "secondary" },
      confirmed: { label: "✓ Confirmed", variant: "default" },
      started: { label: "🔄 In Progress", variant: "default" },
      completed: { label: "✅ Completed", variant: "default" },
      cancelled: { label: "❌ Cancelled", variant: "destructive" },
      declined: { label: "⚠️ Declined", variant: "destructive" },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.job_status);

  return (
    <div className="min-h-screen bg-background pb-20">
      <StickyPageHeader title="Booking Details">
        <div className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-border">
          <Badge variant={statusConfig.variant} className="text-xs sm:text-sm">
            {statusConfig.label}
          </Badge>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {format(new Date(booking.requested_date), "MMM dd, yyyy")}
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            {booking.requested_time}
          </div>
        </div>
      </StickyPageHeader>

      <main className="container max-w-4xl px-4 py-4 sm:py-6">
        {/* Mobile & Desktop: Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status Stepper */}
            {!['cancelled', 'declined'].includes(booking.job_status) && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <StatusStepper currentStatus={booking.job_status} />
                </CardContent>
              </Card>
            )}

            {/* Declined Warning */}
            {isDeclined && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-sm sm:text-base text-destructive">Booking Declined</h3>
                    <p className="text-xs sm:text-sm text-destructive/80">
                      This booking was declined by the provider. Please reassign to another provider.
                    </p>
                    {booking.rejection_reason && (
                      <p className="text-xs sm:text-sm text-destructive/80 mt-1 italic">
                        Reason: {booking.rejection_reason}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Details */}
            {packageInfo && (
              <ServiceDetailsCard
                packageInfo={packageInfo}
                addons={addons}
                totalEstimate={booking.total_estimate}
                totalFinal={booking.total_final}
                overtimeMinutes={booking.overtime_minutes}
                currency={currency}
              />
            )}

            {/* Location */}
            {address && (
              <LocationCard address={address} defaultExpanded={false} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Provider Card */}
            {provider ? (
              <PersonCard
                title="Your Provider"
                person={{
                  ...provider,
                  phone: provider.profiles?.phone,
                  email: provider.profiles?.email || "",
                }}
                onMessage={canMessage ? handleMessage : undefined}
                onNavigate={handleNavigate}
                onViewProfile={() => navigate(`/provider-profile/${provider.id}`)}
              />
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p className="text-sm">No provider assigned yet</p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card className="border-0 shadow-sm sticky top-20">
              <CardContent className="p-4 space-y-2">
                {isDeclined && (
                  <Button
                    onClick={handleReassign}
                    className="w-full gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reassign to Another Provider
                  </Button>
                )}

                {canReview && (
                  <Button
                    onClick={handleReview}
                    className="w-full gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Leave a Review
                  </Button>
                )}

                {canMessage && (
                  <Button
                    variant="outline"
                    onClick={handleMessage}
                    className="w-full gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message Provider
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="outline"
                    onClick={() => setCancelDialogOpen(true)}
                    className="w-full gap-2 text-destructive hover:text-destructive border-destructive/20"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      {canCancel && booking && (
        <CancellationDialog
          bookingId={booking.id}
          open={cancelDialogOpen}
          onClose={() => setCancelDialogOpen(false)}
          bookingDate={booking.requested_date}
          bookingTime={booking.requested_time}
          totalAmount={booking.total_estimate}
          onSuccess={() => {
            toast.success('Booking cancelled successfully');
            setCancelDialogOpen(false);
            fetchBookingDetails();
          }}
        />
      )}

      {booking && canMessage && provider && (
        <ChatDrawer
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          bookingId={booking.id}
          otherPartyName={provider.full_name || "Provider"}
          otherPartyAvatar={provider.photo_url}
        />
      )}
    </div>
  );
};

export default BookingDetails;
