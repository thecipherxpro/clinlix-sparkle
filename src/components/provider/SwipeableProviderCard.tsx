import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Heart } from "lucide-react";
import ProviderCard from "@/components/ProviderCard";
import { cn } from "@/lib/utils";
import { banner } from "@/hooks/use-banner";

interface SwipeableProviderCardProps {
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
  createdAt?: string;
}

export const SwipeableProviderCard = (props: SwipeableProviderCardProps) => {
  const navigate = useNavigate();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 100;
  const MAX_SWIPE = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    // Limit swipe distance
    const limitedDiff = Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, diff));
    setSwipeOffset(limitedDiff);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);

    // Right swipe - Book
    if (swipeOffset > SWIPE_THRESHOLD) {
      if (navigator.vibrate) navigator.vibrate(50);
      banner.success(`Booking with ${props.fullName}`);
      navigate(`/customer/booking?providerId=${props.providerId}`);
    }
    // Left swipe - Save/Favorite
    else if (swipeOffset < -SWIPE_THRESHOLD) {
      if (navigator.vibrate) navigator.vibrate(50);
      banner.success(`${props.fullName} saved to favorites`);
      // Here you would save to favorites
    }

    // Reset position
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-visible touch-pan-y">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        {/* Left Action - Save */}
        <div
          className={cn(
            "flex items-center gap-2 text-white font-medium transition-all",
            swipeOffset < -20 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <div className="bg-pink-500 rounded-full p-3">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          {swipeOffset < -SWIPE_THRESHOLD && <span>Save</span>}
        </div>

        {/* Right Action - Book */}
        <div
          className={cn(
            "flex items-center gap-2 text-white font-medium transition-all",
            swipeOffset > 20 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          {swipeOffset > SWIPE_THRESHOLD && <span>Book Now</span>}
          <div className="bg-green-500 rounded-full p-3">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Card */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? "none" : "transform 0.3s ease-out",
        }}
        className="relative z-10"
      >
        <ProviderCard {...props} showActions={false} />
      </div>
    </div>
  );
};
