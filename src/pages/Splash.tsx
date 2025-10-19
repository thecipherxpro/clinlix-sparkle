import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Splash = () => {
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("Connecting to Clinlix...");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkUserAndRedirect = async () => {
      try {
        // Check if offline
        if (!navigator.onLine) {
          setStatusText("You're offline. Clinlix will load as soon as you reconnect.");
          return;
        }

        setStatusText("Connecting to Clinlix...");

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setTimeout(() => navigate("/auth"), 2500);
          return;
        }

        // If no session, go to auth
        if (!session) {
          setTimeout(() => navigate("/auth"), 2500);
          return;
        }

        // Fetch user profile and role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError || !profile?.role) {
          console.error("Profile error:", profileError);
          // Session expired or invalid profile
          await supabase.auth.signOut();
          setStatusText("Your session has expired. Please log in again.");
          setTimeout(() => navigate("/auth"), 2500);
          return;
        }

        // Redirect based on role
        setStatusText("Loading your dashboard...");
        setTimeout(() => {
          const roleStr = profile.role as string;
          
          if (roleStr === "customer") {
            navigate("/customer/dashboard", { replace: true });
          } else if (roleStr === "provider") {
            navigate("/provider/dashboard", { replace: true });
          } else if (roleStr === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/auth", { replace: true });
          }
        }, 2500);

      } catch (error) {
        console.error("Unexpected error:", error);
        setTimeout(() => navigate("/auth"), 2500);
      }
    };

    // Wait for splash animation to settle, then check
    const timer = setTimeout(checkUserAndRedirect, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        <img 
          src="/images/splash-animation.gif" 
          alt="Clinlix Loading" 
          className="w-full h-auto"
        />
        <p className="text-foreground text-sm font-medium text-center animate-fade-in" style={{ fontFamily: "Inter, Manrope, sans-serif" }}>
          {isOffline ? "You're offline. Clinlix will load as soon as you reconnect." : statusText}
        </p>
      </div>
    </div>
  );
};

export default Splash;
