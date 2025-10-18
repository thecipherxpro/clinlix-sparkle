import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Sparkles, MapPin } from "lucide-react";
import ProviderAvatarBadge from "@/components/ProviderAvatarBadge";

interface ProviderCarouselCardProps {
  providerId: string;
  fullName: string;
  photoUrl?: string;
  verified: boolean;
  newProvider: boolean;
  ratingAvg: number;
  ratingCount: number;
  serviceAreas: string[];
  skills: string[];
  bio?: string;
  createdAt?: string;
}

const ProviderCarouselCard = ({
  providerId,
  fullName,
  photoUrl,
  verified,
  newProvider,
  ratingAvg,
  ratingCount,
  serviceAreas,
  skills,
  bio,
  createdAt,
}: ProviderCarouselCardProps) => {
  const navigate = useNavigate();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(ratingAvg)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full bg-gradient-to-br from-card via-card to-secondary/5">
      {/* Hero Section with Avatar */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-8">
        <div className="flex flex-col items-center">
          {/* Avatar with Badge */}
          <div className="relative mb-4">
            <ProviderAvatarBadge
              imageUrl={photoUrl}
              isVerified={verified}
              createdAt={createdAt}
              size={80}
              alt={fullName}
              className="ring-4 ring-background shadow-xl"
            />
            {/* Status Badge */}
            {verified && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full p-1.5 shadow-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
            {!verified && newProvider && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full p-1.5 shadow-lg">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-lg text-center line-clamp-1 mb-2">
            {fullName}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {renderStars()}
            </div>
            <span className="text-sm font-semibold">{ratingAvg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({ratingCount})</span>
          </div>

          {/* Service Areas */}
          {serviceAreas.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{serviceAreas[0]}</span>
              {serviceAreas.length > 1 && (
                <span className="text-xs">+{serviceAreas.length - 1}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Expertise
            </p>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-medium px-3 py-1 rounded-full border border-primary/20"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-xs bg-muted text-muted-foreground font-medium px-3 py-1 rounded-full">
                  +{skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Bio */}
        {bio && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              About
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {bio}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={() => navigate(`/providers/profile/${providerId}`)}
          className="w-full touch-target bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300"
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};

export default ProviderCarouselCard;
