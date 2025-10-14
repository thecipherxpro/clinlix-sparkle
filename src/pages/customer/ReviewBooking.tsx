import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

      if (bookingData.status !== 'completed') {
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

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('provider_reviews')
        .insert({
          booking_id: id,
          customer_id: user.id,
          provider_id: booking.provider_id,
          rating,
          comment: reviewText || null
        });

      if (error) throw error;

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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/customer/bookings')} 
            className="touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold">Rate Your Experience</h1>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-2xl space-y-6">
        {/* Provider Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-2xl">
              How was your cleaning?
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Rate your experience with {booking.provider_profiles?.full_name}
            </p>
          </CardHeader>
        </Card>

        {/* Rating Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95 touch-target"
                >
                  <Star
                    className={`w-12 h-12 sm:w-14 sm:h-14 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-sm text-muted-foreground mb-6">
                {rating === 5 && "Excellent! 🎉"}
                {rating === 4 && "Great! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Needs improvement 😔"}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tell us more about your experience (optional)
              </label>
              <Textarea
                placeholder="Share details about the service quality, professionalism, or any suggestions..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Summary */}
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service</span>
              <span className="font-medium">
                {booking.customer_addresses?.cleaning_packages?.package_name || 'Cleaning Service'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">
                {new Date(booking.completed_at || booking.requested_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Paid</span>
              <span className="font-medium">
                {booking.customer_addresses?.currency === 'EUR' ? '€' : '$'}
                {booking.total_final || booking.total_estimate}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitReview}
          disabled={submitting || rating === 0}
          className="w-full h-12 text-base bg-gradient-to-r from-primary to-accent"
          size="lg"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </Button>

        <Button
          variant="ghost"
          onClick={() => navigate('/customer/bookings')}
          className="w-full"
        >
          Skip for Now
        </Button>
      </main>
    </div>
  );
};

export default ReviewBooking;
