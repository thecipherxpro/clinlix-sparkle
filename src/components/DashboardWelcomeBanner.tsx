import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
interface DashboardWelcomeBannerProps {
  user: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}
const DashboardWelcomeBanner = ({
  user
}: DashboardWelcomeBannerProps) => {
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const month = today.toLocaleString("en-US", {
    month: "short"
  }).toUpperCase();
  const day = today.getDate();
  const year = today.getFullYear();
  const formattedDate = `${month}, ${day} /${year}`;
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
    /* Mobile-first container: Full width with responsive padding and margins
       - Uses viewport-relative margins for consistent edge spacing across devices
       - Padding scales from mobile (4vw) to tablet (3vw) for optimal content spacing
       - Border radius adapts to screen size for proportional rounded corners */
    <div className="w-fit mx-[4vw] sm:mx-[3vw] my-0">
      <div className="bg-white rounded-[clamp(20px,5vw,24px)] border border-gray-200 shadow-sm 
                      px-[clamp(16px,4vw,24px)] py-[clamp(16px,4.5vw,24px)]">
        
        {/* Flex container: Adapts layout direction based on content and screen size
            - gap uses clamp() to scale proportionally (12px on small, 20px on larger screens)
            - items-start ensures proper alignment on all screen sizes */}
        <div className="flex items-start justify-between gap-[clamp(12px,3vw,20px)]">
          
          {/* Content section: Flexible width that grows to fill available space
              - min-w-0 prevents flex item overflow issues with text truncation */}
          <div className="min-w-0 flex-1">
            
            {/* Typography: Using clamp() for fluid, responsive text scaling
                - Welcome text: scales from 11px to 14px
                - Name heading: scales from 24px (mobile) to 36px (tablet) */}
            <p className="text-[clamp(11px,2.8vw,14px)] text-gray-500 leading-tight">
              Welcome back,
            </p>
            <h1 className="text-[clamp(24px,6.5vw,36px)] font-bold text-gray-800 truncate 
                           leading-[1.2] mt-[clamp(2px,0.5vw,4px)]">
              {user.name}!
            </h1>
            
            {/* Status badges: Responsive spacing with clamp() for consistent gaps
                - Touch-friendly: Minimum 44px height maintained for tap targets
                - flex-wrap ensures proper stacking on narrow screens */}
            <div className="flex items-center gap-[clamp(8px,2vw,12px)] 
                           mt-[clamp(10px,2.5vw,16px)] flex-wrap">
              
              {/* Role badge: Proportional sizing with viewport units */}
              <div className="flex items-center gap-[clamp(4px,1vw,6px)] 
                             py-[clamp(4px,1vw,6px)] min-h-[44px]">
                <span className="w-[clamp(8px,2vw,12px)] h-[clamp(8px,2vw,12px)] 
                               bg-gray-300 rounded-full flex-shrink-0"></span>
                <span className="font-semibold text-gray-600 uppercase tracking-wide 
                               text-[clamp(9px,2.2vw,11px)]">
                  {user.role} PORTAL
                </span>
              </div>
              
              {/* Date badge: Matches role badge styling for consistency */}
              <div className="flex items-center gap-[clamp(4px,1vw,6px)] 
                             py-[clamp(4px,1vw,6px)] min-h-[44px]">
                <span className="w-[clamp(8px,2vw,12px)] h-[clamp(8px,2vw,12px)] 
                               bg-orange-400 rounded-full flex-shrink-0"></span>
                <span className="font-semibold text-gray-600 
                               text-[clamp(9px,2.2vw,11px)]">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>
          
          {/* Avatar section: Touch-optimized with 44px+ tap target
              - Responsive sizing using clamp() for proportional scaling
              - Active touch states with group hover for better UX */}
          <div className="relative group cursor-pointer flex-shrink-0 
                         touch-manipulation active:scale-95 transition-transform" 
               onClick={handleAvatarClick}>
            
            {/* Hidden file input for upload functionality */}
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
              aria-label="Upload profile picture"
            />
            
            {/* Avatar container: Responsive padding and sizing
                - Padding scales with viewport for consistent border effect
                - Minimum 60px size ensures touch target accessibility */}
            <div className="p-[clamp(3px,0.8vw,4px)] rounded-full bg-purple-200">
              <img 
                src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt={user.name} 
                className="w-[clamp(60px,15vw,80px)] h-[clamp(60px,15vw,80px)] 
                          rounded-full object-cover"
              />
            </div>
            
            {/* Upload loading state: Centered spinner overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center 
                             bg-white/80 rounded-full">
                <Loader2 className="w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)] 
                                   animate-spin text-purple-600" />
              </div>
            )}
            
            {/* Upload hover state: Icon overlay on desktop, always visible hint on mobile */}
            {!uploading && (
              <div className="absolute inset-0 flex items-center justify-center 
                             bg-white/80 rounded-full opacity-0 group-hover:opacity-100 
                             group-active:opacity-100 transition-opacity duration-200">
                <Upload className="w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)] 
                                  text-purple-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardWelcomeBanner;