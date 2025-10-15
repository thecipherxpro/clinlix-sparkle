import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-clinlix.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#dacefd]">
      <div className="animate-scale-in">
        <img src={logo} alt="Clinlix Logo" className="w-48 h-48 object-contain animate-pulse" />
      </div>
    </div>
  );
};

export default Splash;
