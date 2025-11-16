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
import { useI18n } from "@/contexts/I18nContext";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStatsSkeleton, DashboardCardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { BookingCardSkeletonList } from "@/components/skeletons/BookingCardSkeleton";

// Import dashboard background images
import bookCleaningBg from "@/assets/dashboard/book-cleaning-bg.jpg";
import bookingsBg from "@/assets/dashboard/bookings-bg.jpg";
import providersBg from "@/assets/dashboard/providers-bg.jpg";
import addressesBg from "@/assets/dashboard/addresses-bg.jpg";
import profileBg from "@/assets/dashboard/profile-bg.jpg";
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [profile, setProfile] = useState<any>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreviewedModal, setShowUnreviewedModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  useEffect(() => {
    checkUser();
  }, []);
  const checkUser = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      const {
        data: profileData
      } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (profileData?.role !== "customer") {
        navigate("/provider/dashboard");
        return;
      }
      setProfile(profileData);

      // Fetch upcoming bookings
      const {
        data: bookingsData
      } = await supabase.from("bookings").select(`
          *,
          customer_addresses(*, cleaning_packages(*)),
          provider_profiles(*)
        `).eq("customer_id", user.id).in("job_status", ["pending", "confirmed", "on_the_way", "arrived", "started"]).order("requested_date", {
        ascending: true
      }).limit(5);
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
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
        <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)]">
          <div className="space-y-6">
            <DashboardStatsSkeleton />
            <BookingCardSkeletonList count={3} />
          </div>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <DashboardHeader 
        firstName={profile?.first_name || "User"}
        lastName={profile?.last_name || ""}
        avatarUrl={profile?.avatar_url}
        notificationCount={notificationCount}
        onNotificationClick={() => setShowNotifications(true)}
      />
      
      {/* Mobile-first header with auto-fit padding */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)]">
        <DashboardWelcomeBanner user={{
        name: profile?.first_name || "User",
        role: "CUSTOMER",
        avatarUrl: profile?.avatar_url
      }} onSearchClick={() => navigate("/customer/find-providers")} />
      </div>

      {/* Mobile-first main container with auto-fit max-width and responsive padding */}
      <main className="w-full max-w-[min(1280px,calc(100%-32px))] py-[clamp(16px,4vw,32px)] px-0 mx-[18px]">
        {/* Quick Actions - Hero Card + 2x2 Grid */}
        <div className="mb-[clamp(20px,5vw,32px)] space-y-4">
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">{t.ui.quickActions}</h3>
          
          {/* Hero Quick Action Card */}
          <div 
            className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group shadow-lg"
            onClick={() => navigate("/customer/booking")}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${bookCleaningBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{t.dashboard.bookCleaning}</h3>
                  </div>
                  <p className="text-white/90 text-sm md:text-base font-medium">
                    {t.ui.scheduleService}
                  </p>
                </div>
                <Button variant="secondary" size="lg" className="hidden md:flex shadow-lg">
                  Book Now
                </Button>
              </div>
            </div>
          </div>

          {/* Secondary Actions Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {[{
              icon: Clock,
              title: t.dashboard.myBookings,
              description: upcomingBookings.length > 0 ? `${upcomingBookings.length} upcoming` : t.dashboard.noBookings,
              onClick: () => navigate("/customer/my-bookings"),
              bgImage: bookingsBg,
              gradientOverlay: "from-emerald-500/90 to-emerald-600/80",
              badge: upcomingBookings.length > 0 ? upcomingBookings.length : null,
              badgeColor: "bg-white text-emerald-600"
            }, {
              icon: Search,
              title: t.dashboard.findProviders,
              description: "Browse cleaners",
              onClick: () => navigate("/customer/providers"),
              bgImage: providersBg,
              gradientOverlay: "from-blue-500/90 to-blue-600/80",
              badge: null,
              badgeColor: ""
            }, {
              icon: MapPin,
              title: t.dashboard.myAddresses,
              description: t.ui.yourLocations,
              onClick: () => navigate("/customer/my-addresses"),
              bgImage: addressesBg,
              gradientOverlay: "from-purple-500/90 to-purple-600/80",
              badge: null,
              badgeColor: ""
            }, {
              icon: User,
              title: t.common.profile,
              description: t.ui.updateInfo,
              onClick: () => navigate("/customer/profile"),
              bgImage: profileBg,
              gradientOverlay: "from-orange-500/90 to-pink-600/80",
              badge: !profile?.phone ? "!" : null,
              badgeColor: "bg-white text-orange-600"
            }].map((action, index) => {
              const Icon = action.icon;
              return (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-md group"
                  onClick={action.onClick}
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${action.bgImage})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradientOverlay}`} />
                  <div className="relative p-4 md:p-6 space-y-3 min-h-[160px] flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      {action.badge && (
                        <span className={`${action.badgeColor} text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center shadow-sm`}>
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <h3 className="text-sm md:text-base font-bold text-white mb-1">{action.title}</h3>
                      <p className="text-xs text-white/90 leading-snug line-clamp-2">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Bookings - Carousel */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <div className="flex items-center justify-between mb-[clamp(12px,3vw,16px)]">
            <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold">{t.dashboard.upcomingBookings}</h3>
            <Button variant="link" className="text-[clamp(12px,3vw,14px)]" onClick={() => navigate("/customer/bookings")}>
              {t.reviews.viewAll}
            </Button>
          </div>

          {upcomingBookings.length === 0 ? <Card className="border-0 shadow-sm">
              <CardContent className="pt-[clamp(24px,6vw,32px)] pb-[clamp(24px,6vw,32px)]">
                <div className="text-center py-[clamp(32px,8vw,48px)]">
                  <Calendar className="w-[clamp(48px,12vw,64px)] h-[clamp(48px,12vw,64px)] 
                                     mx-auto mb-[clamp(16px,4vw,20px)] text-muted-foreground" />
                  <p className="text-[clamp(13px,3.2vw,16px)] text-muted-foreground 
                               mb-[clamp(16px,4vw,20px)]">
                    {t.dashboard.noBookings}
                  </p>
                  <Button onClick={() => navigate("/customer/booking")} className="w-full sm:w-auto px-[clamp(24px,6vw,32px)] 
                             py-[clamp(12px,3vw,16px)] text-[clamp(14px,3.5vw,16px)]">
                    {t.dashboard.startBooking}
                  </Button>
                </div>
              </CardContent>
            </Card> : <Carousel className="w-full" opts={{
          align: "start",
          loop: false
        }}>
              <CarouselContent className="-ml-2 md:-ml-4">
                {upcomingBookings.map(booking => <CarouselItem key={booking.id} className="pl-2 md:pl-4 basis-[85%] sm:basis-[70%] md:basis-1/2 lg:basis-1/3">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full" onClick={() => navigate(`/customer/bookings/${booking.id}`)}>
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
                        year: "numeric"
                      })}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.requested_time}
                          </p>
                        </div>

                        {/* Provider */}
                        {booking.provider_profiles && <div className="flex items-center gap-2 pt-2 border-t">
                            <ProviderAvatarBadge imageUrl={booking.provider_profiles.photo_url} isVerified={booking.provider_profiles.verified} createdAt={booking.provider_profiles.created_at} size={32} alt={booking.provider_profiles.full_name} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs line-clamp-1">{booking.provider_profiles.full_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {booking.customer_addresses?.cleaning_packages?.package_name}
                              </p>
                            </div>
                          </div>}

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-muted-foreground">{t.ui.total}</span>
                          <span className="font-bold text-slate-950">
                            {booking.customer_addresses?.currency === "EUR" ? "€" : "$"}
                            {booking.total_final || booking.total_estimate}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4" />
              <CarouselNext className="hidden sm:flex -right-4" />
            </Carousel>}
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(12px,3vw,16px)]">
          {/* How It Works CTA */}
          <JobCard title={t.howItWorks.title} description={t.howItWorks.subtitle} value={`8 ${t.ui.simpleSteps}`} icon={<Search className="w-4 h-4 sm:w-5 sm:h-5" />} heroColor="#f0f9ff" onClick={() => navigate("/customer/how-it-works")} />

          {/* Pricing Model CTA */}
          <JobCard title={t.pricing.title} description={t.pricing.subtitle} value={t.ui.fixedRates} icon={<CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />} heroColor="#fef3c7" onClick={() => navigate("/customer/pricing")} />
        </div>
      </main>

      {/* Notification Center - Removed, now in DashboardWelcomeBanner */}

      {/* Notification Permission Prompt */}
      <NotificationPermissionPrompt />

      {/* Unreviewed Jobs Modal */}
      {profile && showUnreviewedModal && <UnreviewedJobsModal userId={profile.id} onClose={() => setShowUnreviewedModal(false)} />}
    </div>;
};
export default CustomerDashboard;