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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs md:text-sm">Pending Jobs</CardDescription>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs md:text-sm">Active Today</CardDescription>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs md:text-sm">Monthly Earnings</CardDescription>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">€0</div>
            </CardContent>
          </Card>
        </div>

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
