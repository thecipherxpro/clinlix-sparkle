import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import cleaningLadyImage from "@/assets/cleaning-lady.png";
import clinlixLogoText from "@/assets/clinlix-logo-text.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    checkUser();

    // Trigger animations
    setTimeout(() => setShowContent(true), 100);
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
    <div className="min-h-screen bg-gradient-to-b from-white to-[#EAE6FF] flex flex-col items-center justify-between px-6 py-12 overflow-hidden">
      {/* Dual Cleaners Image */}
      <div
        className={`w-full flex-1 flex items-center justify-center transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <img
          src="https://i.postimg.cc/3wgQwkjQ/Splash-New.png"
          alt="Professional Cleaning Service Team - Male and Female Cleaners"
          className="w-full max-w-sm h-auto object-contain"
        />
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md space-y-6">
        {/* Clinlix Logo Text */}
        <div
          className={`transition-all duration-800 ${
            showContent ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <img
            src="https://i.postimg.cc/rw6HRhZh/Clinlix-writting.png"
            alt="Clinlix"
            className="w-3/5 h-auto mx-auto"
          />
        </div>

        {/* Tagline */}
        <h1
          className={`text-lg font-semibold text-[#222222] text-center transition-all duration-800 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDelay: "600ms",
            fontFamily: "Inter, Manrope, sans-serif",
          }}
        >
          {t.app.tagline}
        </h1>

        {/* Continue Button */}
        <div
          className={`w-full transition-all duration-1000 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1000ms" }}
        >
          <Button
            onClick={() => navigate("/auth")}
            className="relative w-4/5 mx-auto flex items-center justify-center h-[50px] rounded-[30px] bg-gradient-to-r from-[#8A63FF] to-[#6C63FF] hover:from-[#7C3AED] hover:to-[#5C3AED] text-white text-base font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] animate-pulse pr-14"
            style={{
              animationDuration: "3s",
              animationIterationCount: "infinite",
            }}
          >
            {t.common.continue}
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#FFD43B] flex items-center justify-center shadow-md">
              <ChevronRight className="w-6 h-6 text-[#8A63FF]" strokeWidth={3} />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
