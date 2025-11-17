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

  const actionCount = [phone, onMessage, email, onNavigate].filter(Boolean).length;

  return (
    <div className={cn(
      "grid gap-2.5 sm:gap-3",
      actionCount === 4 ? "grid-cols-2" : `grid-cols-${Math.min(actionCount, 3)}`,
      className
    )}>
      {phone && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCall}
          className="flex-col h-auto py-3 sm:py-3.5 gap-1.5 hover:bg-primary/5 hover:text-primary hover:border-primary active:scale-95 transition-all"
          aria-label="Call provider"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-medium">Call</span>
        </Button>
      )}

      {onMessage && (
        <Button
          variant="default"
          size="sm"
          onClick={onMessage}
          className="flex-col h-auto py-3 sm:py-3.5 gap-1.5 active:scale-95 transition-all"
          aria-label="Message provider"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-medium">Chat</span>
        </Button>
      )}

      {email && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmail}
          className="flex-col h-auto py-3 sm:py-3.5 gap-1.5 hover:bg-primary/5 hover:text-primary hover:border-primary active:scale-95 transition-all"
          aria-label="Email provider"
        >
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-medium">Email</span>
        </Button>
      )}

      {onNavigate && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigate}
          className="flex-col h-auto py-3 sm:py-3.5 gap-1.5 hover:bg-primary/5 hover:text-primary hover:border-primary active:scale-95 transition-all"
          aria-label="Navigate to location"
        >
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs font-medium">Navigate</span>
        </Button>
      )}
    </div>
  );
};
