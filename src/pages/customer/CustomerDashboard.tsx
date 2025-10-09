import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, CreditCard, User, LogOut, Search } from "lucide-react";
import { toast } from "sonner";
import MobileNav from "@/components/MobileNav";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clinlix
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer border-2 border-primary/20" onClick={() => navigate('/customer/profile')}>
              <AvatarImage src={profile?.avatar_url} alt={profile?.first_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="touch-target">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Hi, {profile?.first_name} 👋
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome back to your cleaning dashboard
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 sm:mb-8 border-0 shadow-sm">
          <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search for providers..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-base"
                onClick={() => navigate('/customer/providers')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/customer/booking')}
            >
              <CardHeader className="space-y-1 p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Book Cleaning</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Schedule service</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/customer/my-addresses')}
            >
              <CardHeader className="space-y-1 p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Addresses</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your locations</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/customer/payment-methods')}
            >
              <CardHeader className="space-y-1 p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Payment</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Payment methods</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className="cursor-pointer active:scale-95 hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5"
              onClick={() => navigate('/customer/profile')}
            >
              <CardHeader className="space-y-1 p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Profile</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Update info</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Next Booking */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Next Booking</h3>
            <Button variant="link" className="text-sm" onClick={() => navigate('/customer/bookings')}>
              View All
            </Button>
          </div>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
              <div className="text-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No upcoming bookings
                </p>
                <Button onClick={() => navigate('/customer/booking')} className="w-full sm:w-auto">
                  Book a Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Providers */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Recommended Providers</h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6 pb-6 sm:pt-8 sm:pb-8">
              <div className="text-center py-8 sm:py-12">
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  No recommended providers yet
                </p>
                <Button onClick={() => navigate('/customer/providers')} className="w-full sm:w-auto">
                  Find Providers
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
