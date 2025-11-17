import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { banner } from "@/hooks/use-banner";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface BookingReassignmentDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  bookingDetails?: any;
}

export const BookingReassignmentDialog = ({
  open,
  onClose,
  bookingId,
  bookingDetails
}: BookingReassignmentDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<any>(bookingDetails);

  useEffect(() => {
    if (open && !bookingDetails) {
      fetchBookingDetails();
    }
  }, [open, bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer_addresses(*),
          provider_profiles(full_name)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      banner.error('Failed to load booking details');
    }
  };

  const handleSelectNewProvider = () => {
    setLoading(true);
    // Navigate to booking flow with pre-filled data
    const state = {
      addressId: booking.address_id,
      requestedDate: booking.requested_date,
      requestedTime: booking.requested_time,
      addonIds: booking.addon_ids,
      originalBookingId: bookingId
    };
    navigate('/customer/booking', { state });
  };

  const handleChangeDatetime = () => {
    setLoading(true);
    // Navigate to booking flow starting from date/time selection
    const state = {
      addressId: booking.address_id,
      addonIds: booking.addon_ids,
      originalBookingId: bookingId,
      step: 2 // Start at date/time step
    };
    navigate('/customer/booking', { state });
  };

  const handleCancelWithRefund = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-refund', {
        body: {
          bookingId: bookingId,
          reason: 'Provider declined booking'
        }
      });

      if (error) throw error;

      banner.success(`Refund of ${data.currency}${data.refundAmount.toFixed(2)} processed successfully`);
      onClose();
      navigate('/customer/bookings');
    } catch (error: any) {
      console.error('Error processing refund:', error);
      banner.error('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return null;
  }

  const formattedDate = format(new Date(booking.requested_date), 'EEEE, MMMM d, yyyy');
  const currency = booking.customer_addresses?.currency === 'EUR' ? '€' : '$';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-warning mb-2">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>Booking Declined</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            Unfortunately, your provider was unable to accept this booking.
            {booking.rejection_reason && (
              <span className="block mt-2 text-muted-foreground italic">
                Reason: {booking.rejection_reason}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{booking.customer_addresses?.label}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{booking.requested_time}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Amount Paid</span>
              <span>{currency}{booking.total_estimate.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 text-sm text-muted-foreground flex items-start gap-2">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <p>You have 24 hours to choose an option, or the booking will be automatically cancelled with a full refund.</p>
        </div>

        <AlertDialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleSelectNewProvider}
            disabled={loading}
            className="w-full"
            variant="default"
          >
            <User className="w-4 h-4 mr-2" />
            Select New Provider
          </Button>

          <Button
            onClick={handleChangeDatetime}
            disabled={loading}
            className="w-full"
            variant="outline"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Change Date/Time
          </Button>

          <Separator />

          <Button
            onClick={handleCancelWithRefund}
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            Cancel & Get Full Refund ({currency}{booking.total_estimate.toFixed(2)})
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
