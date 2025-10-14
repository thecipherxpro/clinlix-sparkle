import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
interface DashboardWelcomeBannerProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onSearchClick?: () => void;
}

const DashboardWelcomeBanner = ({ user, onSearchClick }: DashboardWelcomeBannerProps) => {
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
    <div className="w-full bg-card rounded-2xl p-4 sm:p-6 shadow-sm border">
      {/* Top Row: Welcome Text + Avatar */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Left: Welcome Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            Welcome
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mt-0.5">
            {user.name}
          </p>
        </div>

        {/* Right: Avatar with Upload */}
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
          
          <div className="relative">
            <img 
              src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt={user.name} 
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-background shadow-md" 
            />
            
            {/* Upload loading state */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
              </div>
            )}
            
            {/* Upload hover state */}
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Role Badge + Search Field */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Role Badge */}
        <Badge 
          variant="secondary" 
          className="w-fit text-xs px-3 py-1.5 uppercase tracking-wide font-semibold"
        >
          {user.role} Portal
        </Badge>

        {/* Search Field */}
        {onSearchClick && (
          <div className="flex-1 relative">
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