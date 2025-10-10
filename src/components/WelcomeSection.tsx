import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: "customer" | "provider" | "admin";
}

export default function WelcomeSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, role")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const getWelcomeMessage = () => {
    if (!profile) return "Welcome";
    
    switch (profile.role) {
      case "customer":
        return `Welcome back, ${profile.first_name} 👋`;
      case "provider":
        return `Hello ${profile.first_name}, ready for your next job?`;
      case "admin":
        return `Welcome, ${profile.first_name} (Admin)`;
      default:
        return `Hello, ${profile.first_name}`;
    }
  };

  if (loading) {
    return (
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-5 w-32 bg-muted rounded" />
            </div>
          </div>
          <div className="h-6 w-6 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent/30 border-b border-border p-6 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Avatar and Welcome Text */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background shadow-md">
            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {profile ? getInitials(profile.first_name, profile.last_name) : "U"}
            </AvatarFallback>
          </Avatar>

          {/* Welcome Text */}
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground font-normal mb-0.5">Welcome</p>
            <p className="text-2xl font-bold text-foreground">
              Hello {profile?.first_name || "User"}
            </p>
          </div>
        </div>

        {/* Right: Notification Bell in white circle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/notifications")}
          className="relative h-14 w-14 rounded-full bg-background hover:bg-background/90 shadow-md"
        >
          <Bell className="h-6 w-6 text-foreground" />
          {/* Optional: Add notification indicator dot */}
          {/* <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full" /> */}
        </Button>
      </div>
    </div>
  );
}
