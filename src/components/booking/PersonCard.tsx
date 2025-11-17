import { User, Star, Shield } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={person.photo_url} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{fullName}</h3>
              {person.verified && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>

            {person.rating_avg !== undefined && person.rating_avg !== null && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{person.rating_avg.toFixed(1)}</span>
                </div>
                {person.rating_count !== undefined && person.rating_count > 0 && (
                  <span className="text-muted-foreground">
                    ({person.rating_count} review{person.rating_count !== 1 ? 's' : ''})
                  </span>
                )}
              </div>
            )}

            {person.email && (
              <p className="text-sm text-muted-foreground truncate mt-1">{person.email}</p>
            )}
            {person.phone && (
              <p className="text-sm text-muted-foreground mt-0.5">{person.phone}</p>
            )}
          </div>
        </div>

        <ContactActionRow
          phone={person.phone}
          email={person.email}
          onMessage={onMessage}
          onNavigate={onNavigate}
        />

        {onViewProfile && (
          <button
            onClick={onViewProfile}
            className="w-full text-sm text-primary hover:underline mt-2"
          >
            View Full Profile
          </button>
        )}
      </CardContent>
    </Card>
  );
};
