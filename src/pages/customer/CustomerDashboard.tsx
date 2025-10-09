import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, CreditCard, User, LogOut, Search } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Clinlix
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Hi, {profile?.first_name} 👋
          </h2>
          <p className="text-muted-foreground">
            Welcome back to your cleaning dashboard
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for providers..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                onClick={() => navigate('/customer/providers')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5"
              onClick={() => navigate('/customer/providers')}
            >
              <CardHeader className="space-y-1 pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Book Cleaning</CardTitle>
                <CardDescription>Schedule a new service</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader className="space-y-1 pb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">My Addresses</CardTitle>
                <CardDescription>Manage your locations</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="space-y-1 pb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Payment</CardTitle>
                <CardDescription>Manage payment methods</CardDescription>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-all border-0 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader className="space-y-1 pb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Update your info</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recommended Providers */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Recommended Providers</h3>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No recommended providers yet
                </p>
                <Button onClick={() => navigate('/customer/providers')}>
                  Find Providers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
