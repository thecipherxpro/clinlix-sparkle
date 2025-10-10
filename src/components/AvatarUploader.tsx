import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploaderProps {
  size?: number;
  editable?: boolean;
  role?: "customer" | "provider" | "admin";
  onUploadSuccess?: (url: string) => void;
}

export default function AvatarUploader({
  size = 100,
  editable = true,
  role = "customer",
  onUploadSuccess,
}: AvatarUploaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url, first_name, last_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setAvatarUrl(profile.avatar_url);
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const getInitials = () => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 512;
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            },
            "image/jpeg",
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG or PNG image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Compress image
      const compressedFile = await compressImage(file);

      // Upload to Supabase Storage
      const filePath = `${user.id}/profile.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL with cache busting
      const timestamp = Date.now();
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      
      const urlWithTimestamp = `${publicUrl}?t=${timestamp}`;

      // Update database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlWithTimestamp })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(urlWithTimestamp);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

      onUploadSuccess?.(urlWithTimestamp);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleImageUpload}
        className="hidden"
        disabled={!editable || isUploading}
      />
      
      <div
        onClick={handleClick}
        className={`relative overflow-hidden rounded-full border-2 border-border shadow-md transition-all duration-200 ${
          editable && !isUploading ? "cursor-pointer hover:scale-105 hover:shadow-lg" : ""
        }`}
        style={{ width: size, height: size }}
      >
        {isUploading ? (
          <div className="flex items-center justify-center w-full h-full bg-accent/50">
            <Loader2 className="animate-spin text-primary" style={{ width: size / 3, height: size / 3 }} />
          </div>
        ) : (
          <Avatar style={{ width: size, height: size }} className="w-full h-full">
            <AvatarImage 
              src={avatarUrl || undefined} 
              alt={`${firstName} ${lastName}`}
              className="object-cover animate-fade-in"
            />
            <AvatarFallback 
              className="bg-primary/10 text-primary font-semibold"
              style={{ fontSize: size / 3 }}
            >
              {getInitials() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      
      {editable && !isUploading && (
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background shadow-md hover:scale-110 transition-transform">
          <Upload className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}
