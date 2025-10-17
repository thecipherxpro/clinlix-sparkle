import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, Tab } from "@heroui/react";
import { ArrowLeft, Calendar, MapPin, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import MobileNav from "@/components/MobileNav";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";
import { StatusBadge } from "@/components/StatusBadge";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

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
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const { error } = await supabase.from("bookings").update({ job_status: "cancelled" }).eq("id", bookingId);

      if (error) throw error;

      toast.success("Booking cancelled");
      checkAuthAndFetchBookings();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const activeBookings = bookings.filter((b) =>
    ["pending", "confirmed", "on_the_way", "arrived", "started"].includes(b.job_status),
  );

  const completedBookings = bookings.filter((b) => b.job_status === "completed");

  const cancelledBookings = bookings.filter((b) => b.job_status === "cancelled");

  const renderBookingCard = (booking: any) => {
    const canCancel = ["pending", "confirmed"].includes(booking.job_status);

    return (
      <Card key={booking.id} className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={booking.job_status} className="w-auto" />
                {booking.payment_status === "paid" && (
                  <div className="badge badge-success text-white border-0 shadow-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold">
                    Paid
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{booking.customer_addresses?.label}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {booking.customer_addresses?.property_type} • {booking.customer_addresses?.layout_type}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/customer/bookings/${booking.id}`)}>
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {new Date(booking.requested_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {booking.requested_time}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {booking.customer_addresses?.country === "Portugal" ? (
                    <>
                      {booking.customer_addresses.rua}, {booking.customer_addresses.localidade}
                    </>
                  ) : (
                    <>
                      {booking.customer_addresses?.street}, {booking.customer_addresses?.city}
                    </>
                  )}
                </p>
              </div>
            </div>

            <Separator />

            {/* Provider */}
            {booking.provider_profiles && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ProviderAvatarBadge
                    imageUrl={booking.provider_profiles.photo_url}
                    isVerified={booking.provider_profiles.verified}
                    createdAt={booking.provider_profiles.created_at}
                    size={40}
                    alt={booking.provider_profiles.full_name}
                  />
                  <div>
                    <p className="font-medium text-sm">{booking.provider_profiles.full_name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {booking.provider_profiles.rating_avg.toFixed(1)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/providers/profile/${booking.provider_profiles.id}`)}
                >
                  View Profile
                </Button>
              </div>
            )}

            <Separator />

            {/* Package & Total */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Package</p>
                <p className="font-medium">{booking.customer_addresses?.cleaning_packages?.package_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold text-lg">
                  {booking.customer_addresses?.currency === "EUR" ? "€" : "$"}
                  {booking.total_final || booking.total_estimate}
                </p>
              </div>
            </div>

            {/* Actions */}
            {canCancel && (
              <div className="pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel Booking
                </Button>
              </div>
            )}

            {booking.job_status === "completed" && !booking.provider_reviews?.length && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/customer/bookings/${booking.id}/review`)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Leave a Review
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customer/dashboard")}
            className="touch-target md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Bookings
          </h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-4xl">
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)} 
          color="secondary"
          radius="lg"
          className="w-full"
          classNames={{
            tabList: "w-full grid grid-cols-3",
            tab: "h-12 sm:h-10 text-xs sm:text-base"
          }}
        >
          <Tab 
            key="active" 
            title={
              <div className="flex items-center gap-1">
                <span>Active</span>
                <span>({activeBookings.length})</span>
              </div>
            }
          >
            <div className="space-y-4 mt-4 sm:mt-6">
            {activeBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">No upcoming bookings</p>
                  <Button onClick={() => navigate("/customer/booking")} className="w-full sm:w-auto">
                    Book a Cleaning Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeBookings.map(renderBookingCard)
            )}
            </div>
          </Tab>

          <Tab 
            key="completed" 
            title={
              <div className="flex items-center gap-1">
                <span>Completed</span>
                <span>({completedBookings.length})</span>
              </div>
            }
          >
            <div className="space-y-4 mt-4 sm:mt-6">
            {completedBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground">No completed bookings</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map(renderBookingCard)
            )}
            </div>
          </Tab>

          <Tab 
            key="cancelled" 
            title={
              <div className="flex items-center gap-1">
                <span>Cancelled</span>
                <span>({cancelledBookings.length})</span>
              </div>
            }
          >
            <div className="space-y-4 mt-4 sm:mt-6">
            {cancelledBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
                  <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm sm:text-base text-muted-foreground">No cancelled bookings</p>
                </CardContent>
              </Card>
            ) : (
              cancelledBookings.map(renderBookingCard)
            )}
            </div>
          </Tab>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
};

export default MyBookings;
