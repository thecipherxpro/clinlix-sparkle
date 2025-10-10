import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import cleaningLadyImage from "@/assets/cleaning-lady.png";
import clinlixLogoText from "@/assets/clinlix-logo-text.png";

const Index = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    checkUser();

    // Trigger animations
    setTimeout(() => setShowContent(true), 100);

    // Auto-redirect after 6 seconds
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();

      if (profile?.role === "provider") {
        navigate("/provider/dashboard");
      } else if (profile?.role === "customer") {
        navigate("/customer/dashboard");
      }
    }
  };

  return (
    <div className="h-190 bg-gradient-to-b from-[#F8FAFC] to-[#CFE9F5] flex flex-col items-center justify-between px-6 py-8 overflow-hidden">
      {/* Cleaning Lady Image */}
      <div
        className={`w-full flex-1 flex items-center justify-center transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        <img
          src={cleaningLadyImage}
          alt="Professional Cleaning Service"
          className="w-full max-w-md h-auto object-contain"
        />
      </div>

      {/* Clinlix Logo Text */}
      <div
        className={`transition-all duration-800 ${
          showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
        style={{ transitionDelay: "600ms" }}
      >
        <img src={clinlixLogoText} alt="Clinlix" className="w-48 h-auto mx-auto" />
      </div>

      {/* Tagline */}
      <h1
        className={`text-lg font-semibold text-[#333333] text-center tracking-wide mt-4 transition-all duration-800 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transitionDelay: "800ms",
          letterSpacing: "0.3px",
        }}
      >
        Trusted Cleaning, Every Single Time
      </h1>

      {/* Buttons Section */}
      <div
        className={`w-full max-w-md flex gap-4 mt-8 mb-6 transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "1200ms" }}
      >
        <Button
          onClick={() => navigate("/auth")}
          className="flex-1 h-12 rounded-[30px] bg-gradient-to-r from-[#8A63FF] to-[#6C63FF] hover:from-[#7A53EF] hover:to-[#5C53EF] text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all hover:scale-105"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate("/auth")}
          className="flex-1 h-12 rounded-[30px] bg-gradient-to-r from-[#55A7FF] to-[#3B89F5] hover:from-[#4597EF] hover:to-[#2B79E5] text-white font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all hover:scale-105"
        >
          Sign Up
        </Button>
      </div>

      {/* Security Footer */}
      <div
        className={`text-center pb-4 transition-all duration-800 ${showContent ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: "1500ms" }}
      >
        <p className="text-[10px] text-[#007B67] font-medium">SECURED BY CipherX Solutions</p>
      </div>
    </div>
  );
};

export default Index;
