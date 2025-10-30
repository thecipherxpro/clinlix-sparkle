import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
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
  
  const isNewProvider = (createdAt?: string | null): boolean => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const daysDiff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 15;
  };

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

  const isNew = isNewProvider(createdAt);
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
      
      {/* NEW Badge overlay for new providers (only if not verified) */}
      {isNew && !isVerified && (
        <Badge
          type="pill-color"
          color="accent"
          size="sm"
          className="absolute -top-1 -right-1 text-[10px] font-bold"
        >
          NEW
        </Badge>
      )}
    </div>
  );
};

export default ProviderAvatarBadge;
