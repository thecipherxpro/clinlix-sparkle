import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Briefcase, User, Clock } from "lucide-react";
import ProviderMobileNav from "@/components/ProviderMobileNav";
import WelcomeSection from "@/components/WelcomeSection";
import ActionCard from "@/components/ActionCard";
import cleaningLadyImage from "@/assets/cleaning-lady.png";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingJobs: 0,
    activeToday: 0,
    monthlyEarnings: 0
  });

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

      if (profileData?.role !== "provider") {
        navigate("/customer/dashboard");
        return;
      }

      setProfile(profileData);

      const { data: providerData } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProviderProfile(providerData);

      // Fetch stats
      if (providerData?.id) {
        const today = new Date().toISOString().split('T')[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

        // Fetch pending jobs
        const { count: pendingCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", providerData.id)
          .eq("status", "pending");

        // Fetch active today
        const { count: activeCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("provider_id", providerData.id)
          .eq("status", "confirmed")
          .eq("requested_date", today);

        // Fetch monthly earnings
        const { data: walletData } = await supabase
          .from("provider_wallet")
          .select("payout_due")
          .eq("provider_id", providerData.id)
          .gte("created_at", firstDayOfMonth);

        const monthlyTotal = walletData?.reduce((sum, record) => sum + Number(record.payout_due || 0), 0) || 0;

        setStats({
          pendingJobs: pendingCount || 0,
          activeToday: activeCount || 0,
          monthlyEarnings: monthlyTotal
        });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      <WelcomeSection />

      <main className="mobile-container py-6 max-w-6xl mx-auto">
        
        {/* Action Card */}
        <div className="mb-6 md:mb-8">
          <ActionCard 
            title="Start Your Day!"
            imageUrl={cleaningLadyImage}
            onSwipeClick={() => navigate('/provider/jobs')}
          />
        </div>

        {/* Professional Stats Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 mb-6 md:mb-8">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Today's Overview</CardTitle>
            <CardDescription>Your current statistics and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Jobs */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Jobs</p>
                  <p className="text-3xl font-bold">{stats.pendingJobs}</p>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
                </div>
              </div>

              {/* Active Today */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Today</p>
                  <p className="text-3xl font-bold">{stats.activeToday}</p>
                  <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
                </div>
              </div>

              {/* Monthly Earnings */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Earnings</p>
                  <p className="text-3xl font-bold">€{stats.monthlyEarnings.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">This month's total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg active:scale-95 transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/provider/jobs')}
            >
              <CardHeader className="space-y-1 pb-4 p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 shadow-md">
                  <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <CardTitle className="text-base md:text-lg">Jobs</CardTitle>
                <CardDescription className="text-xs md:text-sm">Pending requests</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg active:scale-95 transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/provider/schedule')}
            >
              <CardHeader className="space-y-1 pb-4 p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <CardTitle className="text-base md:text-lg">Schedule</CardTitle>
                <CardDescription className="text-xs md:text-sm">Availability</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg active:scale-95 transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/provider/wallet')}
            >
              <CardHeader className="space-y-1 pb-4 p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <CardTitle className="text-base md:text-lg">Wallet</CardTitle>
                <CardDescription className="text-xs md:text-sm">Earnings</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg active:scale-95 transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/provider/profile')}
            >
              <CardHeader className="space-y-1 pb-4 p-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                </div>
                <CardTitle className="text-base md:text-lg">Profile</CardTitle>
                <CardDescription className="text-xs md:text-sm">Your info</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderDashboard;
