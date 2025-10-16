import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Search } from "lucide-react";
import { toast } from "sonner";
import { Chip } from "@heroui/react";
import { NotificationCenter } from "@/components/NotificationCenter";
import { cn } from "@/lib/utils";
interface DashboardWelcomeBannerProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onSearchClick?: () => void;
  className?: string;
}

const DashboardWelcomeBanner = ({ user, onSearchClick, className }: DashboardWelcomeBannerProps) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploading(true);
    try {
      const {
        data: {
          user: authUser
        }
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("Not authenticated");
      const fileExt = file.name.split(".").pop();
      const filePath = `${authUser.id}/profile.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from("avatars").upload(filePath, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const newAvatarUrl = `${publicUrl}?t=${new Date().getTime()}`;
      const {
        error: updateError
      } = await supabase.from("profiles").update({
        avatar_url: newAvatarUrl
      }).eq("id", authUser.id);
      if (updateError) throw updateError;

      // Update provider_profiles if user is a provider
      const {
        data: profileData
      } = await supabase.from("profiles").select("role").eq("id", authUser.id).single();
      if (profileData?.role === "provider") {
        await supabase.from("provider_profiles").update({
          photo_url: newAvatarUrl
        }).eq("user_id", authUser.id);
      }
      setAvatarUrl(newAvatarUrl);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative w-full bg-card rounded-[20px] shadow-lg border overflow-hidden", className)}>
      {/* Geometric Pattern Background */}
      <div className="h-32 sm:h-40 md:h-48 w-full overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient gradientTransform="rotate(222,648,379)" y2="100%" y1="0" x2="0" x1="0" gradientUnits="userSpaceOnUse" id="gradient-bg">
              <stop stopColor="hsl(var(--card))" offset="0" />
              <stop stopColor="hsl(var(--primary))" offset="1" />
            </linearGradient>
            <pattern viewBox="0 0 1080 900" y="0" x="0" height="250" width="300" id="pattern-triangles" patternUnits="userSpaceOnUse">
              <g fillOpacity="0.4">
                <polygon points="90 150 0 300 180 300" fill="hsl(var(--primary) / 0.3)" />
                <polygon points="90 150 180 0 0 0" fill="hsl(var(--accent) / 0.2)" />
                <polygon points="270 150 360 0 180 0" fill="hsl(var(--primary) / 0.4)" />
                <polygon points="450 150 360 300 540 300" fill="hsl(var(--muted) / 0.5)" />
                <polygon points="450 150 540 0 360 0" fill="hsl(var(--primary) / 0.3)" />
                <polygon points="630 150 540 300 720 300" fill="hsl(var(--accent) / 0.3)" />
                <polygon points="630 150 720 0 540 0" fill="hsl(var(--muted) / 0.4)" />
                <polygon points="810 150 720 300 900 300" fill="hsl(var(--primary) / 0.2)" />
                <polygon points="810 150 900 0 720 0" fill="hsl(var(--card-foreground) / 0.1)" />
                <polygon points="990 150 900 300 1080 300" fill="hsl(var(--muted) / 0.5)" />
                <polygon points="990 150 1080 0 900 0" fill="hsl(var(--primary) / 0.3)" />
                <polygon points="90 450 0 600 180 600" fill="hsl(var(--muted) / 0.5)" />
                <polygon points="90 450 180 300 0 300" fill="hsl(var(--accent) / 0.3)" />
                <polygon points="270 450 180 600 360 600" fill="hsl(var(--primary) / 0.2)" />
                <polygon points="270 450 360 300 180 300" fill="hsl(var(--primary) / 0.4)" />
                <polygon points="450 450 360 600 540 600" fill="hsl(var(--muted) / 0.5)" />
                <polygon points="450 450 540 300 360 300" fill="hsl(var(--primary) / 0.3)" />
                <polygon points="630 450 540 600 720 600" fill="hsl(var(--primary) / 0.3)" />
                <polygon points="630 450 720 300 540 300" fill="hsl(var(--card-foreground) / 0.1)" />
                <polygon points="810 450 720 600 900 600" fill="hsl(var(--accent) / 0.3)" />
                <polygon points="810 450 900 300 720 300" fill="hsl(var(--muted) / 0.5)" />
                <polygon points="990 450 900 600 1080 600" fill="hsl(var(--primary) / 0.4)" />
                <polygon points="990 450 1080 300 900 300" fill="hsl(var(--primary) / 0.2)" />
              </g>
            </pattern>
          </defs>
          <rect height="100%" width="100%" fill="url(#gradient-bg)" y="0" x="0" />
          <rect height="100%" width="100%" fill="url(#pattern-triangles)" y="0" x="0" />
        </svg>
      </div>

      {/* Notification Bell - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <NotificationCenter />
      </div>

      {/* Avatar Overlapping Pattern - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ top: 'calc(8rem + 0px)' }}>
        <div 
          className="relative group cursor-pointer flex-shrink-0 touch-manipulation active:scale-95 transition-transform"
          onClick={handleAvatarClick}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
            aria-label="Upload profile picture" 
          />
          
          {/* Outer ring */}
          <div className="bg-card rounded-full p-2 shadow-xl">
            <div className="relative">
              <img 
                src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt={user.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-background shadow-md" 
              />
              
              {/* Upload loading state */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-primary" />
                </div>
              )}
              
              {/* Upload hover state */}
              {!uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Avatar */}
      <div className="pt-14 sm:pt-16 md:pt-20 pb-4 sm:pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
        {/* Name */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mt-2">
          {user.name}
        </h1>
        
        {/* Role Badge */}
        <Chip 
          color="secondary" 
          variant="flat"
          className="mt-3 text-xs px-4 py-1.5 uppercase tracking-wide font-semibold"
        >
          {user.role} Portal
        </Chip>

        {/* Search Field */}
        {onSearchClick && (
          <div className="w-full max-w-md mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Find a provider"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background 
                       focus:ring-2 focus:ring-primary focus:border-transparent 
                       outline-none transition-all text-sm"
              onClick={onSearchClick}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardWelcomeBanner;