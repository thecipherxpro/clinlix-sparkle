import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card as UICard, CardContent, CardDescription, CardHeader as UICardHeader, CardTitle } from "@/components/ui/card";
import { JobCard } from "@/components/ui/premium-card";
import { Calendar, DollarSign, Briefcase, User, Clock } from "lucide-react";
import DashboardWelcomeBanner from "@/components/DashboardWelcomeBanner";
import ActionCard from "@/components/ActionCard";
import cleaningLadyImage from "@/assets/cleaning-lady.png";
import { NotificationCenter } from "@/components/NotificationCenter";
import { NotificationPermissionPrompt } from "@/components/NotificationPermissionPrompt";
import { useI18n } from "@/contexts/I18nContext";
const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
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
      if (profileData?.role !== "provider") {
        navigate("/customer/dashboard");
        return;
      }
      setProfile(profileData);
      const {
        data: providerData
      } = await supabase.from("provider_profiles").select("*").eq("user_id", user.id).single();
      setProviderProfile(providerData);

      // Fetch stats
      if (providerData?.id) {
        const today = new Date().toISOString().split("T")[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0];

        // Fetch pending jobs
        const {
          count: pendingCount
        } = await supabase.from("bookings").select("*", {
          count: "exact",
          head: true
        }).eq("provider_id", providerData.id).eq("status", "pending");

        // Fetch active today
        const {
          count: activeCount
        } = await supabase.from("bookings").select("*", {
          count: "exact",
          head: true
        }).eq("provider_id", providerData.id).eq("status", "confirmed").eq("requested_date", today);

        // Fetch monthly earnings
        const {
          data: walletData
        } = await supabase.from("provider_wallet").select("payout_due").eq("provider_id", providerData.id).gte("created_at", firstDayOfMonth);
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
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      {/* Mobile-first header with auto-fit padding */}
      <div className="w-full px-[clamp(16px,4vw,32px)] pt-[clamp(16px,4vw,24px)]">
        <DashboardWelcomeBanner user={{
        name: profile?.first_name || "User",
        role: "PROVIDER",
        avatarUrl: profile?.avatar_url
      }} className="shadow-md" />
      </div>

      {/* Mobile-first main container with auto-fit max-width */}
      <main className="w-full max-w-[min(1280px,calc(100%-32px))] mx-auto \n                       px-0[clamp(16px,4vw,32px)] py-[clamp(16px,4vw,24px)]">
        {/* Action Card - Auto-fit responsive */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          
        </div>

        {/* Beautiful Stats Card with Weather Card Design */}
        <div className="relative h-[180px] rounded-[25px] overflow-hidden shadow-[rgba(0,0,0,0.15)_2px_3px_4px] 
                        mb-[clamp(20px,5vw,32px)] transition-all duration-100 hover:shadow-lg">
          {/* Info Section */}
          <div className="relative flex items-center justify-between w-full h-[75%] text-white">
            {/* Background Design */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ec7263] to-[#d85d4f] overflow-hidden">
              <div className="absolute top-[-80%] right-[-50%] w-[300px] h-[300px] bg-[#efc745] opacity-40 rounded-full"></div>
              <div className="absolute top-[-70%] right-[-30%] w-[210px] h-[210px] bg-[#efc745] opacity-40 rounded-full"></div>
              <div className="absolute top-[-35%] right-[-8%] w-[100px] h-[100px] bg-[#efc745] opacity-100 rounded-full"></div>
            </div>

            {/* Left Side - Main Stat */}
            <div className="flex flex-col justify-around h-full z-10 pl-[18px]">
              <div className="text-sm font-medium">{t.provider.pendingJobs}</div>
              <div className="text-[34pt] font-medium leading-[1.2]">{stats.pendingJobs}</div>
            </div>

            {/* Right Side - Time & Location */}
            <div className="flex flex-col items-end justify-around h-full pr-[18px] z-10">
              <div className="flex flex-col items-end">
                <div className="text-[19pt] leading-[1em]">
                  {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
                </div>
                <div className="text-[13px]">
                  {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: '2-digit',
                  day: '2-digit'
                }).toUpperCase()}
                </div>
              </div>
              <div className="text-sm font-medium">{t.provider.dashboard}</div>
            </div>
          </div>

          {/* Days Section - Stats Buttons */}
          <div className="flex items-center justify-between w-full h-[25%] bg-[#974859] gap-[2px] shadow-[inset_0px_2px_5px_#974859]">
            <button onClick={() => navigate("/provider/jobs")} className="flex flex-col items-center justify-center h-full w-full bg-[#a75265] shadow-[inset_0px_2px_5px_#974859] 
                         cursor-pointer transition-all duration-100 hover:scale-90 hover:rounded-[10px]">
              <span className="text-[14pt] font-bold text-white">{stats.pendingJobs}</span>
              <span className="text-[7pt] font-medium text-white opacity-70">{t.provider.availableJobs}</span>
            </button>
            
            <button onClick={() => navigate("/provider/wallet")} className="flex flex-col items-center justify-center h-full w-full bg-[#a75265] shadow-[inset_0px_2px_5px_#974859] 
                         cursor-pointer transition-all duration-100 hover:scale-90 hover:rounded-[10px]">
              <span className="text-[14pt] font-bold text-white">€{stats.monthlyEarnings.toFixed(0)}</span>
              <span className="text-[7pt] font-medium text-white opacity-70">{t.provider.earnedThisMonth}</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-[clamp(20px,5vw,32px)]">
          <h3 className="text-[clamp(16px,4vw,22px)] font-semibold mb-[clamp(12px,3vw,16px)]">{t.provider.quickActions}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <JobCard
              title={t.provider.jobs}
              description={t.provider.viewAllJobs}
              image="https://i.postimg.cc/LXSMYzdW/calnder24.png"
              heroColor="#e2e2e4"
              onClick={() => navigate("/provider/jobs")}
            />

            <JobCard
              title={t.provider.schedule}
              description={t.provider.manageAvailability}
              image="https://i.postimg.cc/hjB2bst8/map.png"
              heroColor="#e2e2e4"
              onClick={() => navigate("/provider/schedule")}
            />

            <JobCard
              title={t.provider.wallet}
              description={t.provider.viewEarnings}
              image="https://i.postimg.cc/9MhLtbQp/walletss.png"
              heroColor="#e2e2e4"
              onClick={() => navigate("/provider/wallet")}
            />

            <JobCard
              title={t.provider.profile}
              description={t.provider.editProfile}
              image="https://i.postimg.cc/qRrdh8Vf/Profiles.png"
              heroColor="#e2e2e4"
              onClick={() => navigate("/provider/profile")}
            />
          </div>
        </div>
      </main>

      <NotificationPermissionPrompt />
    </div>;
};
export default ProviderDashboard;