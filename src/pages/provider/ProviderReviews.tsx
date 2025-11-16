import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, User } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/contexts/I18nContext";
import { ReviewSkeletonList } from "@/components/skeletons/ReviewSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderReviews = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchReviews();
  }, []);

  const checkUserAndFetchReviews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData?.role !== 'provider') {
        navigate('/customer/dashboard');
        return;
      }

      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProviderProfile(providerData);

      if (providerData) {
        const { data: reviewsData } = await supabase
          .from('provider_reviews')
          .select(`
            *,
            customer:profiles!customer_id(first_name, last_name),
            booking:bookings(requested_date)
          `)
          .eq('provider_id', providerData.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-yellow-500 text-yellow-500"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
        <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
          <div className="mobile-container py-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-32" />
          </div>
        </header>
        <main className="mobile-container py-6 max-w-4xl space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <Skeleton className="h-16 w-16 mx-auto rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <ReviewSkeletonList count={4} />
        </main>
      </div>
    );
  }

  const averageRating = providerProfile?.rating_avg || 0;
  const totalReviews = providerProfile?.rating_count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/provider/dashboard')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-base md:text-lg font-bold">{t.provider.reviews}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">{t.provider.customerFeedback}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Summary Card */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-muted-foreground">
                {t.provider.basedOn} {totalReviews} {totalReviews === 1 ? t.provider.review : t.provider.reviews}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold">{t.provider.allReviews}</h2>
          
          {reviews.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">{t.provider.noReviewsYet}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t.provider.completeJobsForReviews}
                </p>
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {review.customer?.first_name} {review.customer?.last_name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {new Date(review.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </CardHeader>
                {review.comment && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderReviews;
