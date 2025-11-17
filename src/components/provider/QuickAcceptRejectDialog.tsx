import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { banner } from "@/hooks/use-banner";
import { CheckCircle, XCircle } from "lucide-react";

interface QuickAcceptRejectDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  mode: "accept" | "reject";
  earnings?: string;
  serviceTime?: string;
  onSuccess?: () => void;
}

const REJECTION_REASONS = [
  "Schedule conflict",
  "Too far from service area",
  "Unable to provide requested services",
  "Personal emergency",
  "Other",
];

export const QuickAcceptRejectDialog = ({
  open,
  onClose,
  bookingId,
  mode,
  earnings,
  serviceTime,
  onSuccess,
}: QuickAcceptRejectDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          job_status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

      if (error) throw error;

      banner.success("Job accepted successfully!");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error accepting job:", error);
      banner.error(error.message || "Failed to accept job");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const finalReason =
      rejectionReason === "Other"
        ? customReason.trim()
        : rejectionReason;

    if (!finalReason) {
      banner.error("Please select or provide a rejection reason");
      return;
    }

    setLoading(true);
    try {
      // Call edge function to handle decline notification and customer reassignment
      const { error } = await supabase.functions.invoke('handle-booking-decline', {
        body: {
          bookingId: bookingId,
          rejectionReason: finalReason
        }
      });

      if (error) throw error;

      banner.success("Job declined - Customer notified");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Error rejecting job:", error);
      banner.error(error.message || "Failed to decline job");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "accept") {
    return (
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDialogTitle>Accept this job?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              {earnings && (
                <p className="text-base font-semibold text-foreground">
                  You'll earn €{earnings}
                </p>
              )}
              {serviceTime && (
                <p>Make sure you can arrive on time at {serviceTime}.</p>
              )}
              <p className="text-xs text-muted-foreground">
                Once accepted, the customer will be notified and you'll be expected to fulfill this job.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAccept}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Accepting..." : "Confirm & Accept"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Decline this job?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4">
            <p>Please provide a reason for declining this job request.</p>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Select value={rejectionReason} onValueChange={setRejectionReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rejectionReason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Please specify</Label>
                <Textarea
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Provide details..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReject}
            disabled={loading || !rejectionReason || (rejectionReason === "Other" && !customReason.trim())}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Declining..." : "Confirm Decline"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
