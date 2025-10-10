import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logoImage from "@/assets/logo-clinlix.png";

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    checkUser();
    
    // Trigger animations
    setTimeout(() => setShowContent(true), 100);
    
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 5000);
    
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

  const handleContinue = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4 overflow-hidden">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div 
          className={`transition-all duration-1200 ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <img 
            src={logoImage} 
            alt="Clinlix Logo" 
            className="w-32 h-32 mx-auto mb-8 animate-fade-in"
          />
        </div>

        {/* App Name */}
        <h1 
          className={`text-5xl font-bold tracking-wider transition-all duration-700 delay-500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            CLINLIX
          </span>
        </h1>

        {/* Tagline */}
        <p 
          className={`text-lg text-muted-foreground font-medium tracking-wide transition-all duration-700 delay-1000 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-block animate-fade-in animation-delay-1000">Smart Cleaning.</span>
          {" "}
          <span className="inline-block animate-fade-in animation-delay-1500">Simple Living.</span>
        </p>

        {/* Continue Button */}
        <div 
          className={`pt-8 transition-all duration-700 delay-1500 ${
            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button 
            size="lg" 
            onClick={handleContinue}
            className="group relative overflow-hidden px-8 py-6 text-lg font-semibold animate-pulse-slow"
          >
            <span className="relative z-10">Continue</span>
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1 animate-pulse-slow" />
          </Button>
        </div>

        {/* Footer */}
        <p 
          className={`text-xs text-muted-foreground pt-8 transition-all duration-700 delay-2000 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Professional cleaning services in Portugal & Canada
        </p>
      </div>
    </div>
  );
};

export default Index;
