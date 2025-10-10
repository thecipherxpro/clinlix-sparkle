import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarDisplayProps {
  userId?: string;
  size?: number;
  showName?: boolean;
  className?: string;
  fallbackText?: string;
}

export default function AvatarDisplay({
  userId,
  size = 48,
  showName = false,
  className = "",
  fallbackText,
}: AvatarDisplayProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("avatar_url, first_name, last_name")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setAvatarUrl(profile.avatar_url);
      setFirstName(profile.first_name);
      setLastName(profile.last_name);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    if (fallbackText) return fallbackText;
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  if (loading) {
    return (
      <div 
        className={`rounded-full bg-muted animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar style={{ width: size, height: size }} className="flex-shrink-0">
        <AvatarImage 
          src={avatarUrl || undefined} 
          alt={`${firstName} ${lastName}`}
          className="object-cover"
        />
        <AvatarFallback 
          className="bg-primary/10 text-primary font-semibold"
          style={{ fontSize: size / 3 }}
        >
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className="font-medium truncate">
          {firstName} {lastName}
        </span>
      )}
    </div>
  );
}
