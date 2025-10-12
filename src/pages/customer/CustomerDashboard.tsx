import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, CreditCard, User, Search } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import DashboardWelcomeBanner from "@/components/DashboardWelcomeBanner";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData?.role !== 'customer') {
        navigate('/provider/dashboard');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
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
            name: profile?.first_name || 'User',
            role: 'CUSTOMER',
            avatarUrl: profile?.avatar_url
          }}
        />
      </div>

      {/* Mobile-first main container with auto-fit max-width and responsive padding */}
      <main className="w-full max-w-[min(1280px,calc(100%-32px))] mx-auto 
                       px-[clamp(16px,4vw,32px)] py-[clamp(16px,4vw,32px)]">

        {/* Search Bar - Auto-fit with responsive padding */}
        <Card className="mb-[clamp(20px,5vw,32px)] border-0 shadow-sm">
          <CardContent className="pt-[clamp(16px,4vw,24px)] pb-[clamp(16px,4vw,24px)]">
            <div className="relative">
              <Search className="absolute left-[clamp(12px,3vw,16px)] top-1/2 transform -translate-y-1/2 
                               text-muted-foreground w-[clamp(16px,4vw,20px)] h-[clamp(16px,4vw,20px)]" />
              <input
                type="text"
                placeholder="Find a provider"
                className="w-full pl-[clamp(40px,10vw,56px)] pr-[clamp(16px,4vw,20px)] 
                         py-[clamp(12px,3vw,16px)] rounded-xl border bg-background 
                         focus:ring-2 focus:ring-primary focus:border-transparent 
                         outline-none transition-all text-[clamp(14px,3.5vw,16px)]"
                onClick={() => navigate('/customer/find-providers')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Auto-fit grid with responsive gaps */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,3vw,16px)]">
            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all 
                       border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/customer/booking')}
            >
              <CardHeader className="space-y-1 p-[clamp(16px,4vw,24px)] pb-[clamp(12px,3vw,16px)]">
                <div className="w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] 
                              rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-primary" />
                </div>
                <CardTitle className="text-[clamp(14px,3.5vw,18px)]">Book Now</CardTitle>
                <CardDescription className="text-[clamp(11px,2.8vw,14px)]">Schedule service</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all 
                       border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/customer/my-addresses')}
            >
              <CardHeader className="space-y-1 p-[clamp(16px,4vw,24px)] pb-[clamp(12px,3vw,16px)]">
                <div className="w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] 
                              rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <MapPin className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-accent" />
                </div>
                <CardTitle className="text-[clamp(14px,3.5vw,18px)]">Addresses</CardTitle>
                <CardDescription className="text-[clamp(11px,2.8vw,14px)]">Your locations</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all 
                       border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/customer/payment-methods')}
            >
              <CardHeader className="space-y-1 p-[clamp(16px,4vw,24px)] pb-[clamp(12px,3vw,16px)]">
                <div className="w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] 
                              rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <CreditCard className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-primary" />
                </div>
                <CardTitle className="text-[clamp(14px,3.5vw,18px)]">Payment</CardTitle>
                <CardDescription className="text-[clamp(11px,2.8vw,14px)]">Manage cards</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all 
                       border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/customer/profile')}
            >
              <CardHeader className="space-y-1 p-[clamp(16px,4vw,24px)] pb-[clamp(12px,3vw,16px)]">
                <div className="w-[clamp(40px,10vw,48px)] h-[clamp(40px,10vw,48px)] 
                              rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <User className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-accent" />
                </div>
                <CardTitle className="text-[clamp(14px,3.5vw,18px)]">Profile</CardTitle>
                <CardDescription className="text-[clamp(11px,2.8vw,14px)]">Update info</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Next Booking - Auto-fit responsive */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <div className="flex items-center justify-between mb-[clamp(12px,3vw,16px)]">
            <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold">Next Booking</h3>
            <Button 
              variant="link" 
              className="text-[clamp(12px,3vw,14px)]" 
              onClick={() => navigate('/customer/bookings')}
            >
              View All
            </Button>
          </div>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-[clamp(24px,6vw,32px)] pb-[clamp(24px,6vw,32px)]">
              <div className="text-center py-[clamp(32px,8vw,48px)]">
                <Calendar className="w-[clamp(48px,12vw,64px)] h-[clamp(48px,12vw,64px)] 
                                   mx-auto mb-[clamp(16px,4vw,20px)] text-muted-foreground" />
                <p className="text-[clamp(13px,3.2vw,16px)] text-muted-foreground 
                             mb-[clamp(16px,4vw,20px)]">
                  You haven't booked yet
                </p>
                <Button 
                  onClick={() => navigate('/customer/booking')} 
                  className="w-full sm:w-auto px-[clamp(24px,6vw,32px)] 
                           py-[clamp(12px,3vw,16px)] text-[clamp(14px,3.5vw,16px)]"
                >
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Providers - Auto-fit responsive */}
        <div>
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">
            Recommended Providers
          </h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-[clamp(24px,6vw,32px)] pb-[clamp(24px,6vw,32px)]">
              <div className="text-center py-[clamp(32px,8vw,48px)]">
                <p className="text-[clamp(13px,3.2vw,16px)] text-muted-foreground 
                             mb-[clamp(16px,4vw,20px)]">
                  We're learning your preferences
                </p>
                <Button 
                  onClick={() => navigate('/customer/find-providers')} 
                  className="w-full sm:w-auto px-[clamp(24px,6vw,32px)] 
                           py-[clamp(12px,3vw,16px)] text-[clamp(14px,3.5vw,16px)]"
                >
                  Browse Providers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default CustomerDashboard;
