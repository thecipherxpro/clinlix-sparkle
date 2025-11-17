import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Loader, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { BookingCardSkeletonList } from "@/components/skeletons/BookingCardSkeleton";
import { BookingReassignmentDialog } from "@/components/booking/BookingReassignmentDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StickyPageHeader } from "@/components/StickyPageHeader";
import { Badge } from "@/components/ui/badge";
import { ModernBookingCard } from "@/components/booking/ModernBookingCard";

const MyBookings = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [reassignmentOpen, setReassignmentOpen] = useState(false);
  const [declinedBooking, setDeclinedBooking] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetchBookings();
  }, []);

  const checkAuthAndFetchBookings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (profileData?.role !== "customer") {
        navigate("/provider/dashboard");
        return;
      }

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(
          `
          *,
          customer_addresses(*, cleaning_packages(*)),
          provider_profiles(*)
        `,
        )
        .eq("customer_id", user.id)
        .order("requested_date", { ascending: false });

      setBookings(bookingsData || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error(t.bookings.failedToLoad);
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter((b) =>
    ["pending", "confirmed", "on_the_way", "arrived", "started"].includes(b.job_status),
  );

  const declinedBookings = bookings.filter((b) => b.job_status === "declined");

  const completedBookings = bookings.filter((b) => b.job_status === "completed");

  const cancelledBookings = bookings.filter((b) => b.job_status === "cancelled");

  const handleMessage = (booking: any) => {
    setSelectedBooking(booking);
    setChatOpen(true);
  };

  const handleViewDetails = (booking: any) => {
    navigate(`/customer/booking-details/${booking.id}`);
  };

  const handleReassign = (booking: any) => {
    setDeclinedBooking(booking);
    setReassignmentOpen(true);
  };

  const handleReview = (booking: any) => {
    navigate(`/customer/booking-details/${booking.id}`);
  };

  const renderDeclinedBookingCard = (booking: any) => (
    <div key={booking.id} className="relative">
      {/* Warning Banner */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-t-xl p-3 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-orange-600">Action Required</p>
          <p className="text-xs text-orange-600/80 mt-0.5">
            This booking was declined. Please reassign to another provider.
          </p>
        </div>
      </div>
      {/* Card */}
      <div className="border-t-0">
        <ModernBookingCard
          booking={booking}
          onReassign={handleReassign}
          onViewDetails={handleViewDetails}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="sticky top-0 z-10 bg-background border-b border-border/40">
          <div className="px-4 py-5">
            <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          </div>
        </div>
        <div className="px-4 pt-6">
          <BookingCardSkeletonList count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Sticky Header with Tabs */}
        <StickyPageHeader title="My Bookings">
          <div className="overflow-x-auto pb-3 px-4 pt-2 scrollbar-hide">
            <TabsList className="inline-flex h-auto p-1 bg-muted/50 backdrop-blur-sm rounded-full w-auto min-w-full">
              {declinedBookings.length > 0 && (
                <TabsTrigger 
                  value="declined" 
                  className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-warning data-[state=active]:text-white data-[state=active]:shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Action Required</span>
                  <span className="xs:hidden">Action</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-white/20">
                    {declinedBookings.length}
                  </span>
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="upcoming" 
                className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Loader className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Upcoming</span>
                {activeBookings.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-white/20">
                    {activeBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Completed</span>
                {completedBookings.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-white/20">
                    {completedBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                className="rounded-full px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Cancelled</span>
                {cancelledBookings.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full bg-white/20">
                    {cancelledBookings.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </StickyPageHeader>

        {/* Booking Cards */}
        <div className="px-4 pt-4">
          <TabsContent value="declined" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {declinedBookings.length > 0 ? (
              declinedBookings.map(renderDeclinedBookingCard)
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No declined bookings</p>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <ModernBookingCard
                  key={booking.id}
                  booking={booking}
                  onMessage={handleMessage}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No upcoming bookings</p>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <ModernBookingCard
                  key={booking.id}
                  booking={booking}
                  onReview={handleReview}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No completed bookings</p>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map((booking) => (
                <ModernBookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No cancelled bookings</p>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Chat Drawer */}
      {selectedBooking && (
        <ChatDrawer
          open={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setSelectedBooking(null);
          }}
          bookingId={selectedBooking.id}
          otherPartyName={selectedBooking.provider_profiles?.full_name || "Provider"}
          otherPartyAvatar={selectedBooking.provider_profiles?.photo_url}
        />
      )}

      {/* Reassignment Dialog */}
      <BookingReassignmentDialog
        open={reassignmentOpen}
        onClose={() => {
          setReassignmentOpen(false);
          setDeclinedBooking(null);
          checkAuthAndFetchBookings(); // Refresh bookings
        }}
        bookingId={declinedBooking?.id}
        bookingDetails={declinedBooking}
      />
    </div>
  );
};

export default MyBookings;
