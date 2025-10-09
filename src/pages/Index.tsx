import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Shield, Star, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'provider') {
        navigate('/provider/dashboard');
      } else if (profile?.role === 'customer') {
        navigate('/customer/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Clinlix
          </h1>
          <Button onClick={() => navigate('/auth')}>
            Get Started
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Professional Cleaning Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Clean Homes,
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Happy Lives
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with verified cleaning professionals in Portugal and Canada. Book instantly, manage easily, and enjoy a sparkling clean space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/auth')}>
              Book a Cleaner
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/auth')}>
              Become a Provider
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
              <p className="text-muted-foreground">
                All our cleaning professionals are background-checked and verified
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground">
                Book at your convenience with real-time availability
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rated & Reviewed</h3>
              <p className="text-muted-foreground">
                Read real reviews from customers just like you
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Choose Your Service</h4>
              <p className="text-muted-foreground text-sm">
                Select the cleaning package that fits your space
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Pick a Provider</h4>
              <p className="text-muted-foreground text-sm">
                Browse verified cleaners and book instantly
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Relax & Enjoy</h4>
              <p className="text-muted-foreground text-sm">
                Your space will be spotless when you arrive
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/10 to-accent/10">
          <CardContent className="pt-12 pb-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of happy customers and providers using Clinlix
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Create Your Account
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Clinlix. Professional cleaning services in Portugal & Canada.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
