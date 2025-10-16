import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Sparkles } from "lucide-react";
import AvatarDisplay from "@/components/AvatarDisplay";

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

  return (
    <Card 
      className={`border-0 shadow-sm hover:shadow-md transition-all rounded-xl p-4 ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <AvatarDisplay 
          userId={userId}
          avatarUrl={photoUrl}
          size={64}
          fallbackText={getInitials(fullName)}
          className="flex-shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Name & Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-base sm:text-lg truncate">{fullName}</h3>
            {verified && (
              <div className="badge badge-primary text-xs px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
                <CheckCircle className="w-3 h-3" />
                VERIFIED
              </div>
            )}
            {!verified && newProvider && (
              <div className="badge badge-secondary text-xs px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3" />
                NEW
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {renderStars()}
            </div>
            <span className="text-sm font-medium">{ratingAvg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({ratingCount})</span>
          </div>

          {/* Service Areas */}
          {serviceAreas.length > 0 && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {serviceAreas.join(', ')}
            </p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide">
              {skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full whitespace-nowrap"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1 whitespace-nowrap">
                  +{skills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {bio}
            </p>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/providers/profile/${providerId}`)}
                className="flex-1 touch-target"
              >
                See Details
              </Button>
              {onSelect ? (
                <Button
                  size="sm"
                  onClick={() => onSelect(providerId)}
                  className="flex-1 touch-target"
                  variant={isSelected ? "default" : "default"}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => navigate(`/customer/booking?providerId=${providerId}`)}
                  className="flex-1 touch-target"
                >
                  Book Now
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;
