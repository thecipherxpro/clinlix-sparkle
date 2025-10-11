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
  return <div className="bg-white rounded-3xl border border-gray-200 p-5 w-full max-w-lg mx-auto shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">Welcome back,</p>
          <h1 className="text-4xl font-bold text-gray-800">{user.name}!</h1>
          <div className="flex items-center gap-1 mt-3 my-[3px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 rounded-full flex-shrink-0"></span>
              <span className="font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap text-xs">{user.role} PORTAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-400 rounded-full flex-shrink-0"></span>
              <span className="font-semibold text-gray-600 whitespace-nowrap text-xs text-left">{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="relative group cursor-pointer p-1 rounded-full bg-purple-200 flex-shrink-0" onClick={handleAvatarClick}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <img src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>}
          {!uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-8 w-8 text-purple-600" />
            </div>}
        </div>
      </div>
    </div>;
};
export default DashboardWelcomeBanner;