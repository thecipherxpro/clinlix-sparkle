import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Star, MoreVertical, MessageSquare, AlertTriangle, CheckCircle, XCircle, Loader } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/base/avatar/avatar";
import { useI18n } from "@/contexts/I18nContext";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { BookingCardSkeletonList } from "@/components/skeletons/BookingCardSkeleton";
import { BookingReassignmentDialog } from "@/components/booking/BookingReassignmentDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StickyPageHeader } from "@/components/StickyPageHeader";
import { Badge } from "@/components/ui/badge";

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

  const renderDeclinedBookingCard = (booking: any) => {
    const provider = booking.provider_profiles;
    const address = booking.customer_addresses;
    const packageData = address?.cleaning_packages;

    return (
      <div
        key={booking.id}
        className="bg-card rounded-2xl p-4 shadow-sm border-2 border-warning/50 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          setDeclinedBooking(booking);
          setReassignmentOpen(true);
        }}
      >
        {/* Warning Banner */}
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-warning/10 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-xs font-medium text-warning">Action Required - Click to Reassign</span>
        </div>

        {/* Header: Avatar, Name, Price */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar
              src={provider?.photo_url}
              alt={provider?.full_name || "Provider"}
              fallback={provider?.full_name?.charAt(0) || "P"}
              size="md"
              className="ring-2 ring-warning/50"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {provider?.full_name || "Unassigned"}
              </h3>
              <p className="text-xs text-muted-foreground">{packageData?.package_name || "House Cleaning"}</p>
              {booking.rejection_reason && (
                <p className="text-xs text-warning mt-1 italic">{booking.rejection_reason}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-base font-bold text-foreground">
              €{Number(booking.total_estimate).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Details: Date, Time, Address */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(booking.requested_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{booking.requested_time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {address?.street || address?.rua}, {address?.apt_unit || address?.porta_andar}
            </span>
          </div>
        </div>

        {/* Footer: Status */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4 h-8 text-xs border-warning text-warning hover:bg-warning/10"
            onClick={(e) => {
              e.stopPropagation();
              setDeclinedBooking(booking);
              setReassignmentOpen(true);
            }}
          >
            <AlertTriangle className="w-3 h-3 mr-1.5" />
            Reassign Now
          </Button>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-warning/10 text-warning">
            Declined
          </span>
        </div>
      </div>
    );
  };

  const renderBookingCard = (booking: any) => {
    const provider = booking.provider_profiles;
    const address = booking.customer_addresses;
    const packageData = address?.cleaning_packages;

    return (
      <div
        key={booking.id}
        className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => navigate(`/customer/bookings/${booking.id}`)}
      >
        {/* Header: Avatar, Name, Price */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar
              src={provider?.photo_url}
              alt={provider?.full_name || "Provider"}
              fallback={provider?.full_name?.charAt(0) || "P"}
              size="md"
              className="ring-2 ring-border/50"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {provider?.full_name || "Unassigned"}
              </h3>
              <p className="text-xs text-muted-foreground">{packageData?.package_name || "House Cleaning"}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-foreground">
                  {provider?.rating_avg ? Number(provider.rating_avg).toFixed(1) : "N/A"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-base font-bold text-foreground">
              €{Number(booking.total_estimate).toFixed(2)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add menu functionality here
              }}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Details: Date, Time, Address */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {booking.requested_date === new Date().toISOString().split("T")[0]
                ? "Today"
                : new Date(booking.requested_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{booking.requested_time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {address?.street || address?.rua}, {address?.apt_unit || address?.porta_andar}
            </span>
          </div>
        </div>

        {/* Footer: Message Button & Status */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4 h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              if (provider) {
                setSelectedBooking(booking);
                setChatOpen(true);
              } else {
                toast.info("Provider not assigned yet");
              }
            }}
          >
            <MessageSquare className="w-3 h-3 mr-1.5" />
            Message
          </Button>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              booking.job_status === "completed"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : booking.job_status === "cancelled"
                  ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-primary/10 text-primary"
            }`}
          >
            {booking.job_status.charAt(0).toUpperCase() + booking.job_status.slice(1).replace("_", " ")}
          </span>
        </div>
      </div>
    );
  };

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
      {/* Sticky Header with Tabs */}
      <StickyPageHeader title="My Bookings">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        </Tabs>
      </StickyPageHeader>

      {/* Booking Cards */}
      <div className="px-4 pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="declined" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {declinedBookings.length > 0 ? (
              declinedBookings.map(renderDeclinedBookingCard)
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No declined bookings</p>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {activeBookings.length > 0 ? (
              activeBookings.map(renderBookingCard)
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No upcoming bookings</p>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {completedBookings.length > 0 ? (
              completedBookings.map(renderBookingCard)
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No completed bookings</p>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-0 space-y-3 pb-4 animate-fade-in">
            {cancelledBookings.length > 0 ? (
              cancelledBookings.map(renderBookingCard)
            ) : (
              <p className="text-center text-muted-foreground py-8 text-sm">No cancelled bookings</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

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
