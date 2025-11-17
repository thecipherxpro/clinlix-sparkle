import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  MessageCircle, 
  XCircle, 
  Star, 
  RotateCcw, 
  Calendar, 
  Clock,
  CircleDashed,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Ban,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { StatusStepper } from "@/components/booking/StatusStepper";
import { PersonCard } from "@/components/booking/PersonCard";
import { LocationCard } from "@/components/booking/LocationCard";
import { ServiceDetailsCard } from "@/components/booking/ServiceDetailsCard";
import { CancellationDialog } from "@/components/booking/CancellationDialog";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { BookingDetailsSkeleton } from "@/components/booking/BookingDetailsSkeleton";
import { BookingActionsSheet } from "@/components/booking/BookingActionsSheet";
import { StickyPageHeader } from "@/components/StickyPageHeader";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useIsMobile } from "@/hooks/use-mobile";
import PullToRefresh from "react-pull-to-refresh";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { triggerHaptic } = useHapticFeedback();
  const [booking, setBooking] = useState<any>(null);
  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [actionsSheetOpen, setActionsSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    triggerHaptic('medium');
    await fetchBookingDetails();
    triggerHaptic('success');
  };

  const handleMessage = () => {
    triggerHaptic('light');
    setChatOpen(true);
  };

  const handleReassign = () => {
    triggerHaptic('medium');
    navigate(`/customer/find-providers?bookingId=${id}`);
  };

  const handleReview = () => {
    triggerHaptic('light');
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
        <BookingDetailsSkeleton />
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
    const configs: Record<string, { 
      label: string; 
      variant: "secondary" | "default" | "destructive" | "outline";
      icon: React.ReactNode;
    }> = {
      pending: { 
        label: "Awaiting Confirmation", 
        variant: "secondary",
        icon: <CircleDashed className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
      },
      confirmed: { 
        label: "Confirmed", 
        variant: "default",
        icon: <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
      },
      started: { 
        label: "In Progress", 
        variant: "default",
        icon: <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 animate-spin" />
      },
      completed: { 
        label: "Completed", 
        variant: "default",
        icon: <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
      },
      cancelled: { 
        label: "Cancelled", 
        variant: "destructive",
        icon: <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
      },
      declined: { 
        label: "Declined", 
        variant: "destructive",
        icon: <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.job_status);

  const pageContent = (
    <div className="min-h-screen bg-background pb-safe-bottom">
      <StickyPageHeader title="Booking Details">
        <div className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t">
          <Badge variant={statusConfig.variant} className="text-xs sm:text-sm px-3 py-1.5 font-medium flex items-center">
            {statusConfig.icon}
            {statusConfig.label}
          </Badge>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{format(new Date(booking.requested_date), "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{booking.requested_time}</span>
            </div>
          </div>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                triggerHaptic('light');
                setActionsSheetOpen(true);
              }}
              className="absolute right-3 top-3 h-9 w-9"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          )}
        </div>
      </StickyPageHeader>

      <main className="container max-w-5xl px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Status Stepper */}
            {!['cancelled', 'declined'].includes(booking.job_status) && (
              <Card className="animate-fade-in shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <StatusStepper currentStatus={booking.job_status} />
                </CardContent>
              </Card>
            )}

            {/* Declined Warning */}
            {isDeclined && (
              <Card className="border-destructive/50 bg-destructive/5 animate-scale-in shadow-sm">
                <CardContent className="p-4 sm:p-6 flex items-start gap-3">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive shrink-0 mt-0.5 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base text-destructive">Booking Declined</h3>
                    <p className="text-xs sm:text-sm text-destructive/80 leading-relaxed">
                      This booking was declined by the provider. Please reassign to another provider.
                    </p>
                    {booking.rejection_reason && (
                      <p className="text-xs sm:text-sm text-destructive/80 italic leading-relaxed">
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

          {/* Right Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="space-y-4 sm:space-y-6">
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
                <Card className="animate-fade-in shadow-sm">
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <p className="text-sm">No provider assigned yet</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card className="sticky top-20 animate-fade-in shadow-sm" style={{ animationDelay: '100ms' }}>
                <CardContent className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                  {isDeclined && (
                    <Button
                      onClick={() => {
                        triggerHaptic('medium');
                        handleReassign();
                      }}
                      className="w-full gap-2 h-11 hover-scale transition-all duration-200 font-medium"
                      size="default"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reassign Provider
                    </Button>
                  )}

                  {canReview && (
                    <Button
                      onClick={() => {
                        triggerHaptic('light');
                        handleReview();
                      }}
                      className="w-full gap-2 h-11 hover-scale transition-all duration-200 font-medium"
                      size="default"
                    >
                      <Star className="w-4 h-4" />
                      Leave Review
                    </Button>
                  )}

                  {canMessage && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        triggerHaptic('light');
                        handleMessage();
                      }}
                      className="w-full gap-2 h-11 hover-scale transition-all duration-200 font-medium"
                      size="default"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message Provider
                    </Button>
                  )}

                  {canCancel && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        triggerHaptic('warning');
                        setCancelDialogOpen(true);
                      }}
                      className="w-full gap-2 h-11 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 transition-all duration-200 font-medium"
                      size="default"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Actions Sheet */}
      <BookingActionsSheet
        open={actionsSheetOpen}
        onOpenChange={setActionsSheetOpen}
        canCancel={canCancel}
        canMessage={canMessage}
        canReview={canReview}
        isDeclined={isDeclined}
        onCancel={() => setCancelDialogOpen(true)}
        onMessage={handleMessage}
        onReview={handleReview}
        onReassign={handleReassign}
      />

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

    </div>
  );

  return isMobile ? (
    <PullToRefresh
      onRefresh={handleRefresh}
      resistance={3}
    >
      {pageContent}
    </PullToRefresh>
  ) : (
    pageContent
  );
};

export default BookingDetails;
