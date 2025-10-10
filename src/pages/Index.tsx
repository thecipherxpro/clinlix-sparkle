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
    <div className="min-h-screen bg-gradient-to-b from-[#E8E4F3] to-[#D4C5F9] flex flex-col items-center justify-between px-6 py-12 overflow-hidden">
      {/* Cleaning Team Image */}
      <div
        className={`w-full flex-1 flex items-center justify-center transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <img
          src="https://i.postimg.cc/3wgQwkjQ/Splash-New.png"
          alt="Professional Cleaning Service Team"
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
          style={{ transitionDelay: "400ms" }}
        >
          <img src={clinlixLogoText} alt="Clinlix" className="w-52 h-auto mx-auto" />
        </div>

        {/* Tagline */}
        <h1
          className={`text-xl font-bold text-[#2D2D2D] text-center transition-all duration-800 ${
            showContent ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transitionDelay: "600ms",
          }}
        >
          Trusted Cleaning,<br />Every Single Time
        </h1>

        {/* Continue Button */}
        <div
          className={`w-full transition-all duration-1000 ${
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <Button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-lg font-bold shadow-[0_4px_20px_rgba(139,92,246,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)]"
          >
            Continue
            <svg
              className="w-6 h-6 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
