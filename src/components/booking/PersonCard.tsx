import { User, Star, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactActionRow } from "./ContactActionRow";

interface PersonCardProps {
  title: string;
  person: {
    first_name?: string;
    last_name?: string;
    full_name?: string;
    photo_url?: string;
    phone?: string | null;
    email?: string;
    verified?: boolean;
    rating_avg?: number | null;
    rating_count?: number | null;
  };
  onMessage?: () => void;
  onNavigate?: () => void;
  onViewProfile?: () => void;
}

export const PersonCard = ({
  title,
  person,
  onMessage,
  onNavigate,
  onViewProfile,
}: PersonCardProps) => {
  const fullName = person.full_name || `${person.first_name || ''} ${person.last_name || ''}`.trim();
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover-scale animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-transform duration-200 group-hover:scale-110" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-primary/20 shrink-0 transition-all duration-300 hover:border-primary/50 hover:scale-105">
            <AvatarImage src={person.photo_url} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-base sm:text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base truncate">{fullName}</h3>
              {person.verified && (
                <Badge variant="secondary" className="gap-1 shrink-0 text-xs animate-scale-in">
                  <Shield className="w-3 h-3" />
                  <span className="hidden sm:inline">Verified</span>
                  <span className="sm:hidden">✓</span>
                </Badge>
              )}
            </div>

            {person.rating_avg !== undefined && person.rating_avg !== null && (
              <div className="flex items-center gap-2 text-xs sm:text-sm animate-fade-in">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary text-primary animate-pulse" />
                  <span className="font-medium">{person.rating_avg.toFixed(1)}</span>
                </div>
                {person.rating_count !== undefined && person.rating_count > 0 && (
                  <span className="text-muted-foreground">
                    ({person.rating_count} review{person.rating_count !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            )}

            <div className="space-y-1">
              {person.email && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{person.email}</p>
              )}
              {person.phone && (
                <p className="text-xs sm:text-sm text-muted-foreground">{person.phone}</p>
              )}
            </div>
          </div>
        </div>

        <ContactActionRow
          phone={person.phone}
          email={person.email}
          onMessage={onMessage}
          onNavigate={onNavigate}
        />

        {onViewProfile && (
          <Button
            variant="ghost"
            onClick={onViewProfile}
            className="w-full h-9 text-sm text-primary hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            View Full Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
