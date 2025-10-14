import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
interface DashboardWelcomeBannerProps {
  user: {
    name: string;
    avatarUrl?: string;
  };
}

const DashboardWelcomeBanner = ({ user }: DashboardWelcomeBannerProps) => {
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
    <div className="w-full bg-card rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Welcome Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Welcome
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mt-1">
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
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-background shadow-md" 
            />
            
            {/* Upload loading state */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
            
            {/* Upload hover state */}
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Upload className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardWelcomeBanner;