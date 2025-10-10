import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserProfile {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: "customer" | "provider" | "admin";
}

export default function WelcomeSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (profile?.role === 'provider') {
        await supabase
          .from('provider_profiles')
          .update({ photo_url: avatarUrl })
          .eq('user_id', user.id);
      }

      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Avatar className="h-16 w-16 border-2 border-background shadow-md transition-transform group-hover:scale-105">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                {profile ? getInitials(profile.first_name, profile.last_name) : "U"}
              </AvatarFallback>
            </Avatar>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>

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
