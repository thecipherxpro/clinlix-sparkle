import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Plus, Wallet, TrendingUp, Shield, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { WalletStatsSkeleton, TransactionSkeletonList } from "@/components/skeletons/TransactionSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for demonstration
const mockPaymentMethods = [
  {
    id: "pm_1",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  },
  {
    id: "pm_2",
    brand: "mastercard",
    last4: "5555",
    expMonth: 8,
    expYear: 2026,
    isDefault: false
  }
];

const mockTransactions = [
  {
    id: "tx_1",
    date: "2024-11-14",
    description: "Cleaning Service - 2 Bedroom",
    amount: 89.99,
    status: "completed",
    provider: "Maria Silva"
  },
  {
    id: "tx_2",
    date: "2024-11-10",
    description: "Deep Cleaning Service",
    amount: 129.99,
    status: "completed",
    provider: "João Santos"
  },
  {
    id: "tx_3",
    date: "2024-11-05",
    description: "Cleaning Service - 1 Bedroom",
    amount: 69.99,
    status: "refunded",
    provider: "Ana Costa"
  }
];

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("EUR");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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

      setCurrency(profileData?.currency || "EUR");
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (brand: string) => {
    const icons: { [key: string]: string } = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳"
    };
    return icons[brand.toLowerCase()] || "💳";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background pb-20 md:pb-4">
        <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 safe-top">
          <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center gap-3 max-w-4xl">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          <WalletStatsSkeleton />
          <TransactionSkeletonList count={6} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background pb-20 md:pb-4">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 safe-top">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 max-w-4xl">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/customer/dashboard')} 
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold">
              Wallet
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-6">
        {/* Balance Overview Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <CardContent className="pt-6 pb-8 relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-primary-foreground/80 text-sm mb-1">Available Balance</p>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  {currency === "EUR" ? "€" : "$"}289.97
                </h2>
              </div>
              <Shield className="w-6 h-6 text-primary-foreground/60" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-primary-foreground/70 text-xs mb-1">This Month</p>
                <p className="text-lg font-semibold">{currency === "EUR" ? "€" : "$"}289.97</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-green-300" />
                  <p className="text-primary-foreground/70 text-xs">Total Spent</p>
                </div>
                <p className="text-lg font-semibold">{currency === "EUR" ? "€" : "$"}289.97</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <Button size="sm" className="gap-2" onClick={() => toast.info("Stripe integration coming soon!")}>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Card</span>
              </Button>
            </div>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockPaymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                  {getCardIcon(method.brand)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold capitalize">{method.brand}</p>
                    {method.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    •••• {method.last4} • Exp {method.expMonth}/{method.expYear}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="touch-target">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            {mockPaymentMethods.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No payment methods added yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your booking payment history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.status === "completed" 
                      ? "bg-green-500/10 text-green-600" 
                      : "bg-orange-500/10 text-orange-600"
                  }`}>
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{transaction.provider} • {transaction.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold text-sm sm:text-base ${
                      transaction.status === "refunded" ? "text-orange-600" : ""
                    }`}>
                      {transaction.status === "refunded" ? "-" : ""}{currency === "EUR" ? "€" : "$"}{transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-sm bg-accent/10">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">Secure Payments</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All payments are processed securely through Stripe. Your card details are encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PaymentMethods;
