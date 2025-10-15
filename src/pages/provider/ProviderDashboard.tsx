import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader as UICardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Briefcase, User, Clock } from "lucide-react";
import ProviderMobileNav from "@/components/ProviderMobileNav";
import DashboardWelcomeBanner from "@/components/DashboardWelcomeBanner";
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
    monthlyEarnings: 0,
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
        const today = new Date().toISOString().split("T")[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          .toISOString()
          .split("T")[0];

        // Fetch pending jobs
        const { count: pendingCount } = await supabase
          .from("bookings")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("provider_id", providerData.id)
          .eq("status", "pending");

        // Fetch active today
        const { count: activeCount } = await supabase
          .from("bookings")
          .select("*", {
            count: "exact",
            head: true,
          })
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
          monthlyEarnings: monthlyTotal,
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
      {/* Mobile-first header with auto-fit padding */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)]">
        <DashboardWelcomeBanner
          user={{
            name: profile?.first_name || "User",
            role: "PROVIDER",
            avatarUrl: profile?.avatar_url,
          }}
        />
      </div>

      {/* Mobile-first main container with auto-fit max-width */}
      <main
        className="w-full max-w-[min(1280px,calc(100%-32px))] mx-auto 
                       px-[clamp(16px,4vw,32px)] py-[clamp(14px,3.5vw,24px)]"
      >
        {/* Action Card - Auto-fit responsive */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <ActionCard
            title="Start Your Day!"
            imageUrl={cleaningLadyImage}
            onSwipeClick={() => navigate("/provider/jobs")}
          />
        </div>

        {/* Professional Stats Card - Auto-fit responsive */}
        <UICard
          className="border-0 shadow-lg bg-gradient-to-br from-card via-card to-primary/5 
                       mb-[clamp(20px,5vw,32px)]"
        >
          <UICardHeader className="p-[clamp(16px,4vw,24px)]">
            <CardTitle className="text-[clamp(20px,5vw,28px)]">Today's Overview</CardTitle>
            <CardDescription className="text-[clamp(12px,3vw,14px)]">
              Your current statistics and earnings
            </CardDescription>
          </UICardHeader>
          <CardContent className="px-[clamp(16px,4vw,24px)] pb-[clamp(16px,4vw,24px)]">
            <div className="grid grid-cols-3 gap-[clamp(12px,3vw,24px)]">
              {/* Pending Jobs */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)] 
                              rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center 
                              mb-[clamp(8px,2vw,12px)]"
                >
                  <Briefcase className="w-[clamp(16px,4vw,24px)] h-[clamp(16px,4vw,24px)] text-primary" />
                </div>
                <p className="text-[clamp(9px,2.2vw,14px)] text-muted-foreground mb-1">Pending</p>
                <p className="text-[clamp(20px,5vw,36px)] font-bold">{stats.pendingJobs}</p>
              </div>

              {/* Active Today */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)] 
                              rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center 
                              mb-[clamp(8px,2vw,12px)]"
                >
                  <Clock className="w-[clamp(16px,4vw,24px)] h-[clamp(16px,4vw,24px)] text-accent" />
                </div>
                <p className="text-[clamp(9px,2.2vw,14px)] text-muted-foreground mb-1">Active</p>
                <p className="text-[clamp(20px,5vw,36px)] font-bold">{stats.activeToday}</p>
              </div>

              {/* Monthly Earnings */}
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-[clamp(32px,8vw,48px)] h-[clamp(32px,8vw,48px)] 
                              rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center 
                              mb-[clamp(8px,2vw,12px)]"
                >
                  <DollarSign className="w-[clamp(16px,4vw,24px)] h-[clamp(16px,4vw,24px)] text-primary" />
                </div>
                <p className="text-[clamp(9px,2.2vw,14px)] text-muted-foreground mb-1">Earnings</p>
                <p className="text-[clamp(20px,5vw,36px)] font-bold">€{stats.monthlyEarnings.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </UICard>

        {/* Quick Actions - Evervault Cards */}
        <div>
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(12px,3vw,16px)]">
            {/* Jobs Card */}
            <div
              className="border border-border dark:border-white/[0.2] flex flex-col items-start relative h-[300px] cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate("/provider/jobs")}
            >
              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-foreground" />

              <EvervaultCard text={stats.pendingJobs.toString()} />

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-foreground font-semibold text-lg mb-1">Jobs</h4>
                <p className="text-sm text-muted-foreground">Requests</p>
              </div>
            </div>

            {/* Schedule Card */}
            <div
              className="border border-border dark:border-white/[0.2] flex flex-col items-start relative h-[300px] cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate("/provider/schedule")}
            >
              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-foreground" />

              <EvervaultCard text={<Calendar className="w-12 h-12" />} />

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-foreground font-semibold text-lg mb-1">Schedule</h4>
                <p className="text-sm text-muted-foreground">Manage availability</p>
              </div>
            </div>

            {/* Wallet Card */}
            <div
              className="border border-border dark:border-white/[0.2] flex flex-col items-start relative h-[300px] cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate("/provider/wallet")}
            >
              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-foreground" />

              <EvervaultCard text={`€${stats.monthlyEarnings.toFixed(0)}`} />

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-foreground font-semibold text-lg mb-1">Wallet</h4>
                <p className="text-sm text-muted-foreground">Track payments</p>
              </div>
            </div>

            {/* Profile Card */}
            <div
              className="border border-border dark:border-white/[0.2] flex flex-col items-start relative h-[300px] cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate("/provider/profile")}
            >
              <Icon className="absolute h-6 w-6 -top-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -top-3 -right-3 text-foreground" />
              <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-foreground" />

              <EvervaultCard text={<User className="w-12 h-12" />} />

              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-foreground font-semibold text-lg mb-1">Profile</h4>
                <p className="text-sm text-muted-foreground">Update details</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ProviderMobileNav />
    </div>
  );
};
export default ProviderDashboard;
