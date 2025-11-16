import { Avatar } from "@/components/base/avatar/avatar";
import { cn } from "@/lib/utils";

interface ProviderAvatarBadgeProps {
  imageUrl?: string | null;
  isVerified?: boolean;
  createdAt?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  alt?: string;
  className?: string;
}

const ProviderAvatarBadge = ({
  imageUrl,
  isVerified = false,
  createdAt,
  size = "md",
  alt = "Provider Avatar",
  className = "",
}: ProviderAvatarBadgeProps) => {
  
  // Map number sizes to string variants for backward compatibility
  const getAvatarSize = (size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" => {
    if (typeof size === "string") return size;
    
    // Map pixel sizes to variants
    if (size <= 24) return "xs";
    if (size <= 32) return "sm";
    if (size <= 40) return "md";
    if (size <= 48) return "lg";
    if (size <= 56) return "xl";
    return "2xl";
  };

  const avatarSize = getAvatarSize(size);

  return (
    <div className={cn("relative inline-flex", className)}>
      <Avatar
        src={imageUrl || undefined}
        alt={alt}
        size={avatarSize}
        verified={isVerified}
        fallback={alt?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
      />
    </div>
  );
};

export default ProviderAvatarBadge;
