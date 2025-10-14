import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Clock } from "lucide-react";
import AvatarDisplay from "./AvatarDisplay";

interface UnreviewedJobsModalProps {
  userId: string;
  onClose: () => void;
}

const UnreviewedJobsModal = ({ userId, onClose }: UnreviewedJobsModalProps) => {
  const navigate = useNavigate();
  const [unreviewed, setUnreviewed] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkUnreviewedJobs();
  }, [userId]);

  const checkUnreviewedJobs = async () => {
    try {
      // Get completed bookings
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          completed_at,
          requested_date,
          customer_addresses(label, cleaning_packages(package_name)),
          provider_profiles(id, user_id, full_name)
        `)
        .eq('customer_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (!completedBookings || completedBookings.length === 0) return;

      // Get all reviews for these bookings
      const bookingIds = completedBookings.map(b => b.id);
      const { data: reviews } = await supabase
        .from('provider_reviews')
        .select('booking_id')
        .in('booking_id', bookingIds);

      const reviewedIds = new Set(reviews?.map(r => r.booking_id) || []);

      // Find first unreviewed booking
      const unreviewedBooking = completedBookings.find(b => !reviewedIds.has(b.id));

      if (unreviewedBooking) {
        setUnreviewed(unreviewedBooking);
        setOpen(true);
      }
    } catch (error) {
      console.error('Error checking unreviewed jobs:', error);
    }
  };

  const handleReviewNow = () => {
    setOpen(false);
    navigate(`/customer/bookings/${unreviewed.id}/review`);
  };

  const handleLater = () => {
    setOpen(false);
    onClose();
  };

  if (!unreviewed) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            How was your cleaning?
          </DialogTitle>
          <DialogDescription className="text-center">
            Please rate your last service experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Provider Info */}
          {unreviewed.provider_profiles && (
            <div className="flex items-center justify-center gap-3">
              <AvatarDisplay
                userId={unreviewed.provider_profiles.user_id}
                size={56}
                fallbackText={unreviewed.provider_profiles.full_name.split(' ').map((n: string) => n[0]).join('')}
              />
              <div>
                <p className="font-semibold">{unreviewed.provider_profiles.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {unreviewed.customer_addresses?.cleaning_packages?.package_name}
                </p>
              </div>
            </div>
          )}

          {/* Date */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Completed on {new Date(unreviewed.completed_at || unreviewed.requested_date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleReviewNow}
              className="w-full h-12 bg-gradient-to-r from-primary to-accent text-base"
              size="lg"
            >
              <Star className="w-5 h-5 mr-2" />
              Leave Review
            </Button>
            <Button
              onClick={handleLater}
              variant="ghost"
              className="w-full"
            >
              Remind Me Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UnreviewedJobsModal;
