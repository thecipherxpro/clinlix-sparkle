import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Home, CreditCard } from "lucide-react";
import logoImage from "@/assets/logo-clinlix.png";

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    checkUser();
    
    // Trigger animations
    setTimeout(() => setShowContent(true), 100);
    
    // Auto-redirect after 4 seconds
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 4000);
    
    return () => clearTimeout(timer);
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

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const cards = [
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "Base Cleaning",
      description: "Professional home cleaning for all layouts."
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Add-ons",
      description: "Extra options for kitchens, windows, and more."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      title: "Secure Payment",
      description: "Pay safely through integrated checkout."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/20 flex flex-col items-center justify-between px-6 py-12 overflow-hidden">
      {/* Logo Section */}
      <div 
        className={`transition-all duration-1200 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <img 
          src={logoImage} 
          alt="Clinlix Logo" 
          className="w-24 h-24 mx-auto animate-fade-in"
        />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md space-y-12 flex-1 flex flex-col justify-center">
        {/* Headline */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            <span 
              className={`block transition-all duration-800 ${
                showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              Trusted Cleaning,
            </span>
            <span 
              className={`block transition-all duration-800 delay-200 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Every Single Time.
            </span>
          </h1>
          
          <p 
            className={`text-base text-muted-foreground font-medium transition-all duration-700 delay-500 ${
              showContent ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Smart Cleaning. Simple Living.
          </p>
        </div>

        {/* Floating Cards */}
        <div className="space-y-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl p-5 shadow-lg border border-border/50 transition-all duration-600 hover:shadow-xl hover:-translate-y-1 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${700 + index * 200}ms`,
                animation: showContent ? `float ${3 + index * 0.5}s ease-in-out infinite` : 'none',
                animationDelay: `${index * 0.3}s`
              }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  {card.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-card-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div 
        className={`w-full max-w-md transition-all duration-800 delay-1300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Button 
          size="lg" 
          onClick={handleGetStarted}
          className="group relative w-full overflow-hidden rounded-[50px] px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:shadow-[0_8px_30px_rgb(108,99,255,0.3)] transition-all duration-300"
        >
          <span className="relative z-10">Get Started</span>
          <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 animate-pulse-slow" />
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
