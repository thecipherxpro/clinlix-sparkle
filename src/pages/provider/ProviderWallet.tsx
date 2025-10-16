import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import ProviderMobileNav from "@/components/ProviderMobileNav";

const ProviderWallet = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchWallet();
  }, []);

  const checkUserAndFetchWallet = async () => {
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

      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProviderProfile(providerData);

      if (providerData) {
        const { data: walletData } = await supabase
          .from('provider_wallet')
          .select(`
            *,
            booking:bookings(
              requested_date,
              package:cleaning_packages(package_name)
            )
          `)
          .eq('provider_id', providerData.id)
          .order('created_at', { ascending: false });

        setWallet(walletData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const totalEarned = wallet.reduce((sum, entry) => sum + Number(entry.total_earned || 0), 0);
  const pendingPayout = wallet
    .filter(entry => entry.status === 'pending')
    .reduce((sum, entry) => sum + Number(entry.payout_due || 0), 0);
  const completedPayouts = wallet.filter(entry => entry.status === 'paid');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/provider/dashboard')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Wallet</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Track your earnings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-3">
              <CardDescription>Total Earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold">€{totalEarned.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-accent/5 to-primary/5">
            <CardHeader className="pb-3">
              <CardDescription>Pending Payout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold">€{pendingPayout.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Earnings History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Earnings History</CardTitle>
            <CardDescription>View all your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-sm">Pending</TabsTrigger>
                <TabsTrigger value="paid" className="text-sm">Paid</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {wallet.length === 0 ? (
                  <div className="py-12 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No earnings yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete jobs to start earning
                    </p>
                  </div>
                ) : (
                  wallet.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1">
                          {entry.booking?.package?.package_name || "Cleaning Service"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                          <span>Base: €{Number(entry.base_amount).toFixed(2)}</span>
                          {entry.addon_amount > 0 && (
                            <span className="text-primary">
                              +Add-ons: €{Number(entry.addon_amount).toFixed(2)}
                            </span>
                          )}
                          {entry.overtime_amount > 0 && (
                            <span className="text-accent">
                              +Overtime: €{Number(entry.overtime_amount).toFixed(2)}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            -Fee: €{Number(entry.platform_fee).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-semibold mb-2">
                          €{Number(entry.payout_due).toFixed(2)}
                        </div>
                        <div 
                          className={`badge badge-outline ${entry.status === 'paid' 
                            ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          }`}
                        >
                          {entry.status}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-3">
                {wallet.filter(e => e.status === 'pending').length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No pending payouts
                  </div>
                ) : (
                  wallet
                    .filter(e => e.status === 'pending')
                    .map((entry) => (
                      <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium mb-1">
                            {entry.booking?.package?.package_name || "Cleaning Service"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-lg font-semibold">
                          €{Number(entry.payout_due).toFixed(2)}
                        </div>
                      </div>
                    ))
                )}
              </TabsContent>

              <TabsContent value="paid" className="space-y-3">
                {completedPayouts.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No completed payouts yet
                  </div>
                ) : (
                  completedPayouts.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1">
                          {entry.booking?.package?.package_name || "Cleaning Service"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold mb-1">
                          €{Number(entry.payout_due).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Paid
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderWallet;
