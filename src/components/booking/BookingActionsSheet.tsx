import { MessageCircle, XCircle, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
} from "@/components/ui/bottom-sheet";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface BookingActionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canCancel: boolean;
  canMessage: boolean;
  canReview: boolean;
  isDeclined: boolean;
  onCancel: () => void;
  onMessage: () => void;
  onReview: () => void;
  onReassign: () => void;
}

export const BookingActionsSheet = ({
  open,
  onOpenChange,
  canCancel,
  canMessage,
  canReview,
  isDeclined,
  onCancel,
  onMessage,
  onReview,
  onReassign,
}: BookingActionsSheetProps) => {
  const { triggerHaptic } = useHapticFeedback();

  const handleAction = (action: () => void, hapticStyle: 'light' | 'medium' | 'warning' = 'light') => {
    triggerHaptic(hapticStyle);
    action();
    onOpenChange(false);
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>Booking Actions</BottomSheetTitle>
          <BottomSheetDescription>
            Choose an action for this booking
          </BottomSheetDescription>
        </BottomSheetHeader>

        <div className="px-4 pb-4 space-y-2">
          {isDeclined && (
            <Button
              onClick={() => handleAction(onReassign, 'medium')}
              className="w-full h-12 gap-3 text-base justify-start"
              variant="default"
            >
              <RotateCcw className="w-5 h-5" />
              Reassign to Another Provider
            </Button>
          )}

          {canReview && (
            <Button
              onClick={() => handleAction(onReview, 'light')}
              className="w-full h-12 gap-3 text-base justify-start"
              variant="outline"
            >
              <Star className="w-5 h-5" />
              Leave a Review
            </Button>
          )}

          {canMessage && (
            <Button
              onClick={() => handleAction(onMessage, 'light')}
              className="w-full h-12 gap-3 text-base justify-start"
              variant="outline"
            >
              <MessageCircle className="w-5 h-5" />
              Message Provider
            </Button>
          )}

          {canCancel && (
            <Button
              onClick={() => handleAction(onCancel, 'warning')}
              className="w-full h-12 gap-3 text-base justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              variant="outline"
            >
              <XCircle className="w-5 h-5" />
              Cancel Booking
            </Button>
          )}
        </div>
      </BottomSheetContent>
    </BottomSheet>
  );
};
