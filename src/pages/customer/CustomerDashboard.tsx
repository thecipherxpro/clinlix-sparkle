import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { JobCard } from "@/components/ui/premium-card";
import { Calendar, MapPin, CreditCard, User, Search, Clock } from "lucide-react";
import DashboardWelcomeBanner from "@/components/DashboardWelcomeBanner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";
import UnreviewedJobsModal from "@/components/UnreviewedJobsModal";
import { NotificationCenter } from "@/components/NotificationCenter";
import { NotificationPermissionPrompt } from "@/components/NotificationPermissionPrompt";
import { StatusBadge } from "@/components/StatusBadge";
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreviewedModal, setShowUnreviewedModal] = useState(false);
  useEffect(() => {
    checkUser();
  }, []);
  const checkUser = async () => {
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
      setProfile(profileData);

      // Fetch upcoming bookings
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
        .in("job_status", ["pending", "confirmed", "on_the_way", "arrived", "started"])
        .order("requested_date", {
          ascending: true,
        })
        .limit(5);
      setUpcomingBookings(bookingsData || []);

      // Show unreviewed jobs modal after data is loaded
      if (profileData) {
        setTimeout(() => setShowUnreviewedModal(true), 1000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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
      {/* Mobile-first header with auto-fit padding */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)]">
        <DashboardWelcomeBanner
          user={{
            name: profile?.first_name || "User",
            role: "CUSTOMER",
            avatarUrl: profile?.avatar_url,
          }}
          onSearchClick={() => navigate("/customer/find-providers")}
        />
      </div>

      {/* Mobile-first main container with auto-fit max-width and responsive padding */}
      <main className="w-full max-w-[min(1280px,calc(100%-32px))] py-[clamp(16px,4vw,32px)] px-0 mx-[18px]">
        {/* Quick Actions - Auto-fit grid with responsive gaps */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <JobCard
              title="Book Now"
              description="Schedule service"
              value="New Booking"
              image="https://i.postimg.cc/LXSMYzdW/calnder24.png"
              heroColor="#e1e2e4"
              onClick={() => navigate("/customer/booking")}
            />

            <JobCard
              title="Addresses"
              description="Your locations"
              value="Manage"
              image="https://i.postimg.cc/hjB2bst8/map.png"
              heroColor="#e1e2e4"
              onClick={() => navigate("/customer/my-addresses")}
            />

            <JobCard
              title="Payment"
              description="Manage cards"
              value="Methods"
              image="https://i.postimg.cc/9MhLtbQp/walletss.png"
              heroColor="#e1e2e4"
              onClick={() => navigate("/customer/payment-methods")}
            />

            <JobCard
              title="Profile"
              description="Update info"
              value="Settings"
              image="https://i.postimg.cc/qRrdh8Vf/Profiles.png"
              heroColor="#e1e2e4"
              onClick={() => navigate("/customer/profile")}
            />
          </div>
        </div>

        {/* Upcoming Bookings - Carousel */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <div className="flex items-center justify-between mb-[clamp(12px,3vw,16px)]">
            <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold">Upcoming Bookings</h3>
            <Button
              variant="link"
              className="text-[clamp(12px,3vw,14px)]"
              onClick={() => navigate("/customer/bookings")}
            >
              View All
            </Button>
          </div>

          {upcomingBookings.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-[clamp(24px,6vw,32px)] pb-[clamp(24px,6vw,32px)]">
                <div className="text-center py-[clamp(32px,8vw,48px)]">
                  <Calendar
                    className="w-[clamp(48px,12vw,64px)] h-[clamp(48px,12vw,64px)] 
                                     mx-auto mb-[clamp(16px,4vw,20px)] text-muted-foreground"
                  />
                  <p
                    className="text-[clamp(13px,3.2vw,16px)] text-muted-foreground 
                               mb-[clamp(16px,4vw,20px)]"
                  >
                    You haven't booked yet
                  </p>
                  <Button
                    onClick={() => navigate("/customer/booking")}
                    className="w-full sm:w-auto px-[clamp(24px,6vw,32px)] 
                             py-[clamp(12px,3vw,16px)] text-[clamp(14px,3.5vw,16px)]"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {upcomingBookings.map((booking) => (
                  <CarouselItem
                    key={booking.id}
                    className="pl-2 md:pl-4 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3"
                  >
                    <Card
                      className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full"
                      onClick={() => navigate(`/customer/bookings/${booking.id}`)}
                    >
                      <CardContent className="p-4 space-y-3">
                        {/* Status Badge */}
                        <StatusBadge status={booking.job_status} />

                        {/* Date & Time */}
                        <div>
                          <p className="font-semibold text-sm sm:text-base line-clamp-1">
                            {booking.customer_addresses?.label}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(booking.requested_date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.requested_time}
                          </p>
                        </div>

                        {/* Provider */}
                        {booking.provider_profiles && (
                          <div className="flex items-center gap-2 pt-2 border-t">
                            <ProviderAvatarBadge
                              imageUrl={booking.provider_profiles.photo_url}
                              isVerified={booking.provider_profiles.verified}
                              createdAt={booking.provider_profiles.created_at}
                              size={32}
                              alt={booking.provider_profiles.full_name}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs line-clamp-1">{booking.provider_profiles.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.customer_addresses?.cleaning_packages?.package_name}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-muted-foreground">Total</span>
                          <span className="font-bold text-primary">
                            {booking.customer_addresses?.currency === "EUR" ? "€" : "$"}
                            {booking.total_final || booking.total_estimate}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4" />
              <CarouselNext className="hidden sm:flex -right-4" />
            </Carousel>
          )}
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(12px,3vw,16px)]">
          {/* How It Works CTA */}
          <JobCard
            title="How It Works"
            description="Learn the booking process"
            value="8 Simple Steps"
            icon={<Search className="w-4 h-4 sm:w-5 sm:h-5" />}
            heroColor="#f0f9ff"
            onClick={() => navigate("/customer/how-it-works")}
          />

          {/* Pricing Model CTA */}
          <JobCard
            title="Pricing Model"
            description="View our transparent pricing"
            value="Fixed Rates"
            icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />}
            heroColor="#fef3c7"
            onClick={() => navigate("/customer/pricing")}
          />
        </div>
      </main>

      {profile && showUnreviewedModal && (
        <UnreviewedJobsModal userId={profile.id} onClose={() => setShowUnreviewedModal(false)} />
      )}

      <NotificationPermissionPrompt />
    </div>
  );
};
export default CustomerDashboard;
