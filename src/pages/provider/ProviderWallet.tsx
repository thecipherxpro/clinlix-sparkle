import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";
import { WalletStatsSkeleton, TransactionSkeletonList } from "@/components/skeletons/TransactionSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderWallet = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
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
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
        <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
          <div className="mobile-container py-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <main className="mobile-container py-6 max-w-6xl space-y-6">
          <WalletStatsSkeleton />
          <TransactionSkeletonList count={8} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/provider/dashboard')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-base md:text-lg font-bold">{t.provider.wallet}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">{t.provider.trackEarnings}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">{t.provider.totalEarned}</CardDescription>
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
              <CardDescription className="text-xs">{t.provider.pendingPayout}</CardDescription>
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
            <CardTitle className="text-base">{t.provider.earningsHistory}</CardTitle>
            <CardDescription className="text-xs">{t.provider.viewAllTransactions}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full bg-muted p-1 rounded-lg mb-4">
                <TabsTrigger value="all">{t.provider.all}</TabsTrigger>
                <TabsTrigger value="pending">{t.provider.pending}</TabsTrigger>
                <TabsTrigger value="paid">{t.provider.paid}</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
            
            <div className="space-y-3">
            {wallet.length === 0 ? (
                  <div className="py-12 text-center">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">{t.provider.noEarningsYet}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t.provider.completeJobsToEarn}
                    </p>
                  </div>
                ) : (
                  wallet.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium mb-1 text-sm">
                          {entry.booking?.package?.package_name || "Cleaning Service"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                          <span>{t.provider.base}: €{Number(entry.base_amount).toFixed(2)}</span>
                          {entry.addon_amount > 0 && (
                            <span className="text-primary">
                              +{t.provider.addons}: €{Number(entry.addon_amount).toFixed(2)}
                            </span>
                          )}
                          {entry.overtime_amount > 0 && (
                            <span className="text-accent">
                              +{t.provider.overtime}: €{Number(entry.overtime_amount).toFixed(2)}
                            </span>
                          )}
                          <span className="text-muted-foreground">
                            -{t.provider.fee}: €{Number(entry.platform_fee).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-base font-semibold mb-2">
                          €{Number(entry.payout_due).toFixed(2)}
                        </div>
                        <div 
                          className={`badge badge-outline text-[10px] ${entry.status === 'paid' 
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
              </div>
              </TabsContent>

              <TabsContent value="pending">
                {/* Same content filtered by pending */}
              </TabsContent>

              <TabsContent value="paid">
                {/* Same content filtered by paid */}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProviderWallet;
