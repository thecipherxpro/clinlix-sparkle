import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, Briefcase, User, LogOut, Clock, Star } from "lucide-react";
import { toast } from "sonner";
import ProviderMobileNav from "@/components/ProviderMobileNav";

const ProviderDashboard = () => {
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

      if (profileData?.role !== 'provider') {
        navigate('/customer/dashboard');
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate('/auth');
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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clinlix Provider
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="touch-target">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Hi, {profile?.first_name} 👋
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your cleaning jobs and schedule
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Pending Jobs</CardDescription>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Active Today</CardDescription>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs sm:text-sm">Monthly Earnings</CardDescription>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">€0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5 touch-target"
              onClick={() => navigate('/provider/jobs')}
            >
              <CardHeader className="space-y-1 pb-4 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg">View Jobs</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Check requests</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5 touch-target"
              onClick={() => navigate('/provider/schedule')}
            >
              <CardHeader className="space-y-1 pb-4 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Schedule</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Availability</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5 touch-target"
              onClick={() => navigate('/provider/wallet')}
            >
              <CardHeader className="space-y-1 pb-4 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Wallet</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Earnings</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5 touch-target"
              onClick={() => navigate('/provider/reviews')}
            >
              <CardHeader className="space-y-1 pb-4 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Reviews</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Feedback</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5 touch-target"
              onClick={() => navigate('/provider/profile')}
            >
              <CardHeader className="space-y-1 pb-4 p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Profile</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your info</CardDescription>
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
