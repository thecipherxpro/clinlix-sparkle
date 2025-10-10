import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Shield, Sparkles, Mail, Phone, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ProviderProfile = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState(false);

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  const fetchProviderData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('id', providerId)
        .single();

      setProvider(providerData);

      const { data: reviewsData } = await supabase
        .from('provider_reviews')
        .select('*, profiles(first_name, last_name)')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      setReviews(reviewsData || []);

      if (user) {
        const { data: bookingData } = await supabase
          .from('bookings')
          .select('id')
          .eq('customer_id', user.id)
          .eq('provider_id', providerId)
          .in('status', ['confirmed', 'on_the_way', 'arrived', 'started', 'completed'])
          .limit(1);

        setHasConfirmedBooking(!!bookingData && bookingData.length > 0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/customer/booking');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Provider not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-24 md:pb-8">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Provider Profile
          </h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-4xl pb-24">
        {/* Cover Section */}
        <div className="relative mb-6 sm:mb-8">
          <div className="h-32 sm:h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl" />
          <div className="absolute -bottom-12 sm:-bottom-16 left-4 sm:left-8">
            <AvatarDisplay 
              userId={provider.user_id}
              size={window.innerWidth >= 640 ? 128 : 96}
              fallbackText={provider.full_name.split(' ').map((n: string) => n[0]).join('')}
              className="border-4 border-background rounded-full"
            />
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          {/* Header Info */}
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            {provider.new_provider && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                NEW
              </Badge>
            )}
            {provider.verified && (
              <Badge className="gap-1">
                <Shield className="w-3 h-3" />
                VERIFIED
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold">{provider.full_name}</h1>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm sm:text-base">{provider.rating_avg.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm sm:text-base">({provider.rating_count})</span>
            </div>
          </div>

          {provider.skills && provider.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {provider.skills.map((skill: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-4 sm:my-6" />

          {/* Tabs */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full h-12 sm:h-10">
              <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews ({provider.rating_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              {provider.bio && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{provider.bio}</p>
                  </CardContent>
                </Card>
              )}

              {provider.experience_years > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Experience</h3>
                    <p className="text-muted-foreground">
                      {provider.experience_years} {provider.experience_years === 1 ? 'year' : 'years'} of professional cleaning experience
                    </p>
                  </CardContent>
                </Card>
              )}

              {provider.service_areas && provider.service_areas.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Service Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.service_areas.map((area: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {provider.languages && provider.languages.length > 0 && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">Languages</h3>
                    <p className="text-muted-foreground">
                      {provider.languages.join(', ')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4 mt-4 sm:mt-6">
              {reviews.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-12 pb-12 text-center">
                    <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </CardContent>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">
                            {review.profiles?.first_name} {review.profiles?.last_name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-4 h-4 ${
                                  idx < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground">{review.comment}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg z-50 safe-bottom">
        <div className="mobile-container py-3 sm:py-4 max-w-4xl">
          {hasConfirmedBooking ? (
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="h-12 sm:h-10">
                <MessageSquare className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Message</span>
              </Button>
              <Button variant="outline" size="sm" className="h-12 sm:h-10">
                <Phone className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Call</span>
              </Button>
              <Button variant="outline" size="sm" className="h-12 sm:h-10">
                <Mail className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Email</span>
              </Button>
            </div>
          ) : (
            <Button className="w-full h-12 sm:h-11 text-base" onClick={handleBookNow}>
              Book Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
