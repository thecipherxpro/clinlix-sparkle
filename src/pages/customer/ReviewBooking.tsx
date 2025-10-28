import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button as HeroButton } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer_addresses(*),
          provider_profiles(*)
        `)
        .eq('id', id)
        .eq('customer_id', user.id)
        .single();

      if (error) throw error;

      if (bookingData.job_status !== 'completed') {
        toast.error('You can only review completed bookings');
        navigate('/customer/bookings');
        return;
      }

      // Check if already reviewed
      const { data: existingReview } = await supabase
        .from('provider_reviews')
        .select('id')
        .eq('booking_id', id)
        .single();

      if (existingReview) {
        toast.error('You have already reviewed this booking');
        navigate('/customer/bookings');
        return;
      }

      setBooking(bookingData);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to load booking details');
      navigate('/customer/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    // Validate review comment length
    if (reviewText.length > 1000) {
      toast.error('Review comment must be 1000 characters or less');
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Insert review
      const { error: reviewError } = await supabase
        .from('provider_reviews')
        .insert({
          booking_id: id,
          customer_id: user.id,
          provider_id: booking.provider_id,
          rating,
          comment: reviewText || null
        });

      if (reviewError) throw reviewError;

      // Mark booking as reviewed
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ has_review: true })
        .eq('id', id);

      if (bookingError) throw bookingError;

      toast.success('✅ Thank you! Your feedback helps improve Clinlix.');
      navigate('/customer/bookings');
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-6">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <HeroButton 
            isIconOnly
            variant="light"
            onPress={() => navigate('/customer/bookings')} 
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </HeroButton>
          <h1 className="text-lg sm:text-xl font-bold">Rate Your Experience</h1>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-2xl space-y-6">
        {/* Rating Card */}
        <Card className="p-6 rounded-2xl shadow-xl border-0">
          <h2 className="text-lg font-semibold text-foreground mb-2">Rate Your Cleaning</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your feedback helps us improve our service
          </p>

          {/* Provider Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {booking.provider_profiles?.full_name?.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {booking.provider_profiles?.full_name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {booking.customer_addresses?.cleaning_packages?.package_name}
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Your Rating</label>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className={`transition-transform ${
                    star <= (hoveredRating || rating) ? 'scale-110' : ''
                  } touch-target`}
                >
                  <Star
                    size={30}
                    className={star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"}
                    fill={star <= (hoveredRating || rating) ? "#FACC15" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground mb-4">
                {rating === 5 && "Excellent! 🎉"}
                {rating === 4 && "Great! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Needs improvement 😔"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Write your experience... (Optional)
              </label>
              <span className={`text-xs ${reviewText.length > 1000 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {reviewText.length}/1000
              </span>
            </div>
            <Textarea
              placeholder="Share details about your cleaning experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              maxLength={1000}
              className="resize-none w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </Card>

        {/* Booking Summary */}
        <Card className="p-6 rounded-2xl shadow-sm border-0">
          <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium text-foreground">
                {booking.customer_addresses?.cleaning_packages?.package_name || 'Cleaning Service'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium text-foreground">
                {new Date(booking.completed_at || booking.requested_date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-semibold text-foreground">
                {booking.customer_addresses?.currency === 'EUR' ? '€' : '$'}
                {booking.total_final || booking.total_estimate}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubmitReview}
            disabled={submitting || rating === 0}
            className="w-full h-12 shadow-lg"
            size="lg"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button
            onClick={() => navigate('/customer/bookings')}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Skip for Now
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ReviewBooking;
