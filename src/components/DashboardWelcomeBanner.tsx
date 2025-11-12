import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Search } from "lucide-react";
import { toast } from "sonner";
import { NotificationCenter } from "@/components/NotificationCenter";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";
interface DashboardWelcomeBannerProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  onSearchClick?: () => void;
  className?: string;
}
const DashboardWelcomeBanner = ({
  user,
  onSearchClick,
  className
}: DashboardWelcomeBannerProps) => {
  const { t } = useI18n();
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
  return <div className={cn("relative w-full bg-card rounded-[20px] shadow-lg border overflow-hidden", className)}>
      {/* Geometric Pattern Background */}
      <div className="h-24 sm:h-32 md:h-40 w-full overflow-hidden bg-[#d8d8d9]"></div>

      {/* Language Toggle - Top Left */}
      <div className="absolute top-4 left-4 z-10">
        <LanguageToggle />
      </div>

      {/* Notification Bell - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <NotificationCenter />
      </div>

      {/* Avatar Overlapping Pattern - Centered */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{
      top: "calc(6rem + 0px)"
    }}>
        <div className="relative group cursor-pointer flex-shrink-0 touch-manipulation active:scale-95 transition-transform touch-target" onClick={handleAvatarClick}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" aria-label="Upload profile picture" />

          {/* Outer ring */}
          <div className="bg-card rounded-full p-1.5 shadow-xl">
            <div className="relative">
              <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-3 border-background shadow-md" />

              {/* Upload loading state */}
              {uploading && <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                  <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 animate-spin text-primary" />
                </div>}

              {/* Upload hover state */}
              {!uploading && <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Avatar */}
      <div className="pt-10 sm:pt-12 md:pt-16 pb-3 sm:pb-4 px-3 sm:px-4 flex flex-col items-center text-center">
        {/* Name */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mt-1">{user.name}</h1>

        {/* Role Badge */}
        <div className="badge badge-soft badge-accent mt-2 text-xs sm:text-sm uppercase tracking-wide font-semibold px-3 sm:px-4">
          {user.role} {t.ui.portal}
        </div>

        {/* Search Field */}
        {onSearchClick && <div className="w-full max-w-md mt-3 relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder={t.ui.findProvider} className="w-full pl-9 pr-3 py-2.5 sm:py-2 rounded-lg border bg-background 
                       focus:ring-2 focus:ring-primary focus:border-transparent 
                       outline-none transition-all text-sm min-h-[44px] touch-target cursor-pointer" onClick={onSearchClick} readOnly />
          </div>}
      </div>
    </div>;
};
export default DashboardWelcomeBanner;