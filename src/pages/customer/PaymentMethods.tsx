import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Payment Methods
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Manage Payment Methods</CardTitle>
            <CardDescription>
              Add and manage your payment methods for seamless bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Stripe Integration Coming Soon</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We're working on integrating secure payment processing with Stripe. 
                Soon you'll be able to save your payment methods for quick and easy bookings.
              </p>
              
              <div className="bg-accent/20 rounded-lg p-6 max-w-md mx-auto mb-6">
                <h4 className="font-semibold mb-2">What's Coming:</h4>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Save multiple credit/debit cards securely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Set default payment method</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Automatic payment after provider confirmation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Payment history and receipts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    <span>Secure PCI-compliant processing</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                For now, you can continue booking services. Payment collection will be handled manually.
              </p>
              
              <Button onClick={() => navigate('/customer/booking')}>
                <Plus className="w-4 h-4 mr-2" />
                Book a Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-sm mt-6 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                <span className="text-primary font-bold">i</span>
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Secure & Safe</p>
                <p className="text-muted-foreground">
                  When payment integration goes live, all transactions will be processed through 
                  Stripe, a industry-leading payment platform trusted by millions of businesses worldwide.
                  Your payment information will never be stored on our servers.
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
