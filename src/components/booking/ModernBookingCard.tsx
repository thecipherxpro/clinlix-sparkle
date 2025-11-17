import { useState, useRef } from "react";
import { Calendar, MapPin, Clock, ChevronDown, MessageCircle, Eye, RotateCcw, XCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ModernBookingCardProps {
  booking: any;
  onMessage?: (booking: any) => void;
  onViewDetails?: (booking: any) => void;
  onReassign?: (booking: any) => void;
  onCancel?: (booking: any) => void;
  onReview?: (booking: any) => void;
}

export const ModernBookingCard = ({
  booking,
  onMessage,
  onViewDetails,
  onReassign,
  onCancel,
  onReview,
}: ModernBookingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);

  const SWIPE_THRESHOLD = 80;
  const MAX_SWIPE = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    const limitedDiff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));
    setSwipeOffset(limitedDiff);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // Right swipe - Message
    if (swipeOffset > SWIPE_THRESHOLD && onMessage) {
      if (navigator.vibrate) navigator.vibrate(50);
      onMessage(booking);
    }
    // Left swipe - View Details
    else if (swipeOffset < -SWIPE_THRESHOLD && onViewDetails) {
      if (navigator.vibrate) navigator.vibrate(50);
      onViewDetails(booking);
    }

    setSwipeOffset(0);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
      pending: { label: "Pending", variant: "secondary", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
      confirmed: { label: "Confirmed", variant: "default", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
      in_progress: { label: "In Progress", variant: "default", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
      completed: { label: "Completed", variant: "outline", color: "bg-green-500/10 text-green-600 border-green-500/20" },
      cancelled: { label: "Cancelled", variant: "destructive", color: "bg-red-500/10 text-red-600 border-red-500/20" },
      declined: { label: "Declined", variant: "destructive", color: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(booking.job_status);
  const providerName = booking.provider_profiles?.full_name || "Unassigned";
  const providerPhoto = booking.provider_profiles?.photo_url;
  const packageName = booking.cleaning_packages?.package_name || "Service";
  const addressLabel = booking.customer_addresses?.label;
  const addressStreet = booking.customer_addresses?.street || booking.customer_addresses?.rua;

  return (
    <div className="relative overflow-visible touch-pan-y">
      {/* Swipe Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none rounded-xl">
        {/* Left Action - View Details */}
        <div
          className={cn(
            "flex items-center gap-2 text-white font-medium transition-all duration-200",
            swipeOffset < -20 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <div className="bg-primary rounded-full p-3 shadow-lg">
            <Eye className="w-5 h-5" />
          </div>
          {swipeOffset < -SWIPE_THRESHOLD && <span className="text-sm font-semibold">Details</span>}
        </div>

        {/* Right Action - Message */}
        <div
          className={cn(
            "flex items-center gap-2 text-white font-medium transition-all duration-200",
            swipeOffset > 20 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          {swipeOffset > SWIPE_THRESHOLD && <span className="text-sm font-semibold">Message</span>}
          <div className="bg-green-500 rounded-full p-3 shadow-lg">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        className="relative z-10 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-all duration-200"
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0">
                <AvatarImage src={providerPhoto} alt={providerName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {providerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-foreground truncate">{providerName}</h3>
                <p className="text-sm text-muted-foreground truncate">{packageName}</p>
              </div>
            </div>
            <Badge className={cn("shrink-0 px-3 py-1 text-xs font-medium border", statusConfig.color)}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Essential Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{format(new Date(booking.requested_date), "MMM dd, yyyy")}</span>
              <Clock className="h-4 w-4 shrink-0 text-primary ml-2" />
              <span className="truncate">{booking.requested_time}</span>
            </div>
            {addressLabel && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{addressLabel}</span>
              </div>
            )}
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="pt-3 border-t border-border space-y-2 text-sm animate-accordion-down">
              {addressStreet && (
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Address: </span>
                  {addressStreet}
                </div>
              )}
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Total: </span>
                €{booking.total_estimate.toFixed(2)}
              </div>
              {booking.addon_ids && booking.addon_ids.length > 0 && (
                <div className="text-muted-foreground">
                  <span className="font-medium text-foreground">Add-ons: </span>
                  {booking.addon_ids.length} selected
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {/* Status-based primary actions */}
            {booking.job_status === "declined" && onReassign && (
              <Button
                size="sm"
                onClick={() => onReassign(booking)}
                className="flex-1 h-9 gap-2 bg-primary hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="font-medium">Reassign</span>
              </Button>
            )}

            {booking.job_status === "completed" && !booking.has_review && onReview && (
              <Button
                size="sm"
                onClick={() => onReview(booking)}
                className="flex-1 h-9 gap-2 bg-primary hover:bg-primary/90"
              >
                <Star className="h-4 w-4" />
                <span className="font-medium">Review</span>
              </Button>
            )}

            {(booking.job_status === "pending" || booking.job_status === "confirmed") && (
              <>
                {onMessage && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMessage(booking)}
                    className="flex-1 h-9 gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">Message</span>
                  </Button>
                )}
                {onCancel && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCancel(booking)}
                    className="h-9 px-3 text-destructive hover:text-destructive border-destructive/20"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}

            {/* View Details Button - Always visible */}
            {onViewDetails && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(booking)}
                className="h-9 px-3 gap-2 border-primary/20 text-primary hover:bg-primary/10"
                title="View full booking details"
              >
                <Eye className="h-4 w-4" />
                <span className="font-medium hidden sm:inline">Details</span>
              </Button>
            )}

            {/* Expand/Collapse Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-9 px-3 shrink-0"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
