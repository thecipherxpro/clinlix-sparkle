import { BadgeInfo } from "lucide-react";
import { CheckmarkBadge03Icon } from "hugeicons-react";

interface ProviderAvatarBadgeProps {
  imageUrl?: string | null;
  isVerified?: boolean;
  createdAt?: string | null;
  size?: number;
  alt?: string;
  className?: string;
}

const ProviderAvatarBadge = ({
  imageUrl,
  isVerified = false,
  createdAt,
  size = 80,
  alt = "Provider Avatar",
  className = "",
}: ProviderAvatarBadgeProps) => {
  
  const isNewProvider = (createdAt?: string | null): boolean => {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const daysDiff = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff < 15;
  };

  const isNew = isNewProvider(createdAt);

  // Starburst SVG for new providers
  const StarburstIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
      <path d="M12 18L13.5 22L15 18" />
      <path d="M9 18L7.5 22L9 18" />
    </svg>
  );

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${alt}${isNew ? " - New Provider" : isVerified ? " - Verified" : ""}`}
    >
      {/* Avatar Container */}
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="w-1/2 h-1/2 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Badge Icon at bottom-right */}
      <div 
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white rounded-full shadow-sm flex items-center justify-center"
        style={{ 
          width: size * 0.35, 
          height: size * 0.35,
          padding: size * 0.04
        }}
      >
        {isNew ? (
          <div className="text-black w-full h-full">
            <StarburstIcon />
          </div>
        ) : isVerified ? (
          <CheckmarkBadge03Icon 
            size={size * 0.25}
            color="#9f00f5"
          />
        ) : (
          <BadgeInfo 
            size={size * 0.27} 
            color="#005f6b" 
            strokeWidth={1.5} 
          />
        )}
      </div>
    </div>
  );
};

export default ProviderAvatarBadge;
