import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Info, AlertCircle } from "lucide-react";

interface CancellationDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  bookingDate: string;
  bookingTime: string;
  totalAmount: number;
  onSuccess?: () => void;
}

export const CancellationDialog = ({
  open,
  onClose,
  bookingId,
  bookingDate,
  bookingTime,
  totalAmount,
  onSuccess,
}: CancellationDialogProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{ amount: number; percentage: number } | null>(null);

  useEffect(() => {
    if (open) {
      calculateRefund();
    }
  }, [open, bookingId]);

  const calculateRefund = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc("calculate_cancellation_refund", {
        p_booking_id: bookingId,
        p_cancelled_by: user.id,
      });

      if (error) throw error;
      if (data && data.length > 0) {
        setRefundInfo({
          amount: data[0].refund_amount,
          percentage: data[0].refund_percentage,
        });
      }
    } catch (error) {
      console.error("Error calculating refund:", error);
    }
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update booking status
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ job_status: "cancelled" })
        .eq("id", bookingId);

      if (bookingError) throw bookingError;

      // Create cancellation policy record
      const { error: policyError } = await supabase
        .from("cancellation_policies")
        .insert({
          booking_id: bookingId,
          cancelled_by: user.id,
          cancellation_reason: reason.trim(),
          refund_amount: refundInfo?.amount || 0,
          refund_percentage: refundInfo?.percentage || 0,
        });

      if (policyError) throw policyError;

      toast.success("Booking cancelled successfully");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const getRefundMessage = () => {
    if (!refundInfo) return null;

    const { percentage, amount } = refundInfo;
    
    if (percentage === 100) {
      return (
        <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <Info className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">Full Refund</p>
            <p className="text-xs text-green-700 dark:text-green-300">
              You'll receive a 100% refund (€{amount.toFixed(2)})
            </p>
          </div>
        </div>
      );
    } else if (percentage > 0) {
      return (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Partial Refund</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              You'll receive a {percentage}% refund (€{amount.toFixed(2)})
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">No Refund</p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Cancellations within 12 hours are not eligible for refunds
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="text-sm text-foreground">
              <p className="font-medium mb-1">Cancellation Policy:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• 48+ hours before: 100% refund</li>
                <li>• 24-48 hours before: 50% refund</li>
                <li>• 12-24 hours before: 25% refund</li>
                <li>• Less than 12 hours: No refund</li>
              </ul>
            </div>

            {refundInfo && getRefundMessage()}

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for cancellation *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for cancelling this booking..."
                rows={3}
                className="resize-none"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={loading || !reason.trim()}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Cancelling..." : "Confirm Cancellation"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
