import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { JobCard } from "@/components/ui/premium-card";
import { WobbleCard } from "@/components/ui/wobble-card";
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

        {/* Stats Cards with Wobble Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,4vw,24px)] mb-[clamp(20px,5vw,32px)]">
          <WobbleCard
            containerClassName="bg-gradient-to-br from-primary to-primary/80 min-h-[200px]"
            className="py-10"
          >
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/80 mb-2">Pending Jobs</p>
              <p className="text-4xl font-bold">{stats.pendingJobs}</p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-gradient-to-br from-accent to-accent/80 min-h-[200px]"
            className="py-10"
          >
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/80 mb-2">Active Today</p>
              <p className="text-4xl font-bold">{stats.activeToday}</p>
            </div>
          </WobbleCard>

          <WobbleCard
            containerClassName="bg-gradient-to-br from-primary to-primary/80 min-h-[200px]"
            className="py-10"
          >
            <div className="flex flex-col items-center text-center text-white">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6" />
              </div>
              <p className="text-sm text-white/80 mb-2">Monthly Earnings</p>
              <p className="text-4xl font-bold">€{stats.monthlyEarnings.toFixed(2)}</p>
            </div>
          </WobbleCard>
        </div>

        {/* Quick Actions - Job Cards */}
        <div>
          <h3 className="text-[clamp(18px,4.5vw,24px)] font-semibold mb-[clamp(12px,3vw,16px)]">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(16px,4vw,24px)]">
            <JobCard
              title="View Pending Jobs"
              description="Review new job requests"
              value={`${stats.pendingJobs} Pending`}
              icon={<Briefcase className="w-8 h-8" />}
              heroColor="#fef4e2"
              onClick={() => navigate("/provider/jobs")}
            />
            
            <JobCard
              title="Manage Schedule"
              description="Set your availability"
              value="Available"
              icon={<Calendar className="w-8 h-8" />}
              heroColor="#e0f2fe"
              onClick={() => navigate("/provider/schedule")}
            />
            
            <JobCard
              title="Check Earnings"
              description="View payment history"
              value={`€${stats.monthlyEarnings.toFixed(0)}`}
              icon={<DollarSign className="w-8 h-8" />}
              heroColor="#dcfce7"
              onClick={() => navigate("/provider/wallet")}
            />
            
            <JobCard
              title="Update Profile"
              description="Edit your information"
              value="Profile"
              icon={<User className="w-8 h-8" />}
              heroColor="#fae8ff"
              onClick={() => navigate("/provider/profile")}
            />
          </div>
        </div>
      </main>

      <ProviderMobileNav />
    </div>
  );
};
export default ProviderDashboard;
