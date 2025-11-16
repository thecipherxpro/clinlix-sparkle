import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Sparkles } from "lucide-react";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";

interface ProviderCardProps {
  providerId: string;
  userId: string;
  fullName: string;
  photoUrl?: string;
  verified: boolean;
  newProvider: boolean;
  ratingAvg: number;
  ratingCount: number;
  serviceAreas: string[];
  skills: string[];
  bio?: string;
  showActions?: boolean;
  onSelect?: (providerId: string) => void;
  isSelected?: boolean;
  createdAt?: string;
}

const ProviderCard = ({
  providerId,
  userId,
  fullName,
  photoUrl,
  verified,
  newProvider,
  ratingAvg,
  ratingCount,
  serviceAreas,
  skills,
  bio,
  showActions = true,
  onSelect,
  isSelected = false,
  createdAt,
}: ProviderCardProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(ratingAvg)
            ? "fill-yellow-500 text-yellow-500"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(providerId);
    } else {
      navigate(`/provider-profile/${providerId}`);
    }
  };

  return (
    <Card 
      className={`border-0 shadow-sm hover:shadow-md active:shadow-lg transition-all rounded-xl p-4 cursor-pointer active:scale-[0.98] touch-manipulation ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <ProviderAvatarBadge
          imageUrl={photoUrl}
          isVerified={verified}
          createdAt={createdAt}
          size="lg"
          alt={fullName}
          className="flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Name & Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg truncate">{fullName}</h3>
              {verified && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Verified</span>
                </div>
              )}
            </div>
            {!verified && newProvider && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-medium text-orange-700">New</span>
              </div>
            )}
          </div>

          {/* Rating - Larger & More Prominent */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-base font-bold">{ratingAvg.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({ratingCount} reviews)</span>
          </div>

          {/* Service Areas - With Icon */}
          {serviceAreas.length > 0 && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1 flex items-center gap-1.5">
              <span className="text-muted-foreground">📍</span>
              {serviceAreas.slice(0, 2).join(', ')}
              {serviceAreas.length > 2 && ` +${serviceAreas.length - 2}`}
            </p>
          )}

          {/* Skills - Max 3 Visible */}
          {skills.length > 0 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide pb-1">
              {skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full whitespace-nowrap font-medium"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1 whitespace-nowrap font-medium">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions - Only Show if Explicitly Requested */}
          {showActions && (
            <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
              {onSelect ? (
                <Button
                  size="lg"
                  onClick={() => onSelect(providerId)}
                  className="flex-1 min-h-[48px]"
                  variant={isSelected ? "default" : "default"}
                >
                  {isSelected ? 'Selected' : 'Select Provider'}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(`/provider-profile/${providerId}`)}
                    className="flex-1 min-h-[48px]"
                  >
                    View Profile
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => navigate(`/customer/booking?providerId=${providerId}`)}
                    className="flex-1 min-h-[48px]"
                  >
                    Book Now
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
