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
          src="https://i.postimg.cc/zXHMBm7s/Cleaning-lady.png"
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
            fontFamily: "Inter, Manrope, sans-serif"
          }}
        >
          Trusted Cleaning,<br />Every Single Time
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
            className="w-4/5 mx-auto flex items-center justify-center h-[50px] rounded-[30px] bg-gradient-to-r from-[#8A63FF] to-[#6C63FF] hover:from-[#7C3AED] hover:to-[#5C3AED] text-white text-base font-semibold shadow-[0_4px_15px_rgba(0,0,0,0.15)] transition-all hover:scale-[1.02] animate-pulse"
            style={{
              animationDuration: "3s",
              animationIterationCount: "infinite"
            }}
          >
            Continue
            <svg
              className="w-5 h-5 ml-2 fill-[#FFD43B]"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.3 17.275c-.225-.225-.225-.587 0-.812L16.875 13H5c-.35 0-.625-.275-.625-.625s.275-.625.625-.625h11.875l-3.575-3.463c-.225-.225-.225-.587 0-.812s.587-.225.812 0l4.713 4.588c.225.225.225.587 0 .812l-4.713 4.588c-.225.225-.587.225-.812 0z"/>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
