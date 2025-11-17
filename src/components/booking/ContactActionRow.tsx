import { Phone, MessageCircle, Mail, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactActionRowProps {
  phone?: string | null;
  email?: string;
  onMessage?: () => void;
  onNavigate?: () => void;
  className?: string;
}

export const ContactActionRow = ({
  phone,
  email,
  onMessage,
  onNavigate,
  className,
}: ContactActionRowProps) => {
  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleEmail = () => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  return (
    <div className={cn("grid grid-cols-4 gap-2", className)}>
      {phone && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="flex-col h-auto py-3 gap-1"
          title="Call"
        >
          <Phone className="w-4 h-4" />
          <span className="text-xs">Call</span>
        </Button>
      )}

      {onMessage && (
        <Button
          variant="default"
          size="sm"
          onClick={onMessage}
          className="flex-col h-auto py-3 gap-1"
          title="Message"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">Chat</span>
        </Button>
      )}

      {email && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmail}
          className="flex-col h-auto py-3 gap-1"
          title="Email"
        >
          <Mail className="w-4 h-4" />
          <span className="text-xs">Email</span>
        </Button>
      )}

      {onNavigate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigate}
          className="flex-col h-auto py-3 gap-1"
          title="Navigate"
        >
          <Navigation className="w-4 h-4" />
          <span className="text-xs">Navigate</span>
        </Button>
      )}
    </div>
  );
};
