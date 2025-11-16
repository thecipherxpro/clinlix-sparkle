import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Phone, Clock, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const ProviderProfile = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");

  useEffect(() => {
    fetchProviderData();
  }, [providerId]);

  const fetchProviderData = async () => {
    try {
      const { data: providerData } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("id", providerId)
        .single();
      setProvider(providerData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate("/customer/booking");
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Provider not found</p>
      </div>
    );
  }

  const primarySkill = provider.skills?.[0] || "House Cleaning";
  const experienceText = provider.experience_years 
    ? `${provider.experience_years} years exp` 
    : "5 years exp";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-32 w-32 rounded-full mb-4">
            <AvatarImage src={provider.photo_url} alt={provider.full_name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-3xl font-semibold">
              {provider.full_name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
            </AvatarFallback>
          </Avatar>

          {/* Name with Verified Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{provider.full_name}</h1>
            {provider.verified && (
              <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* New Provider Badge */}
          {!provider.verified && provider.new_provider && (
            <Badge variant="secondary" className="mb-2">
              NEW
            </Badge>
          )}

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground mb-2">
            {primarySkill} • {experienceText}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-foreground font-semibold">
              {provider.rating_avg?.toFixed(1) || "4.9"}
            </span>
            <span className="text-muted-foreground text-sm">
              ({provider.rating_count || 156} reviews)
            </span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 text-sm text-primary mb-4">
            <Clock className="w-4 h-4" />
            <span>Available today</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="p-3 border border-border rounded-full hover:bg-muted transition-colors">
              <MessageSquare className="w-5 h-5 text-foreground" />
            </button>
            <button className="p-3 border border-border rounded-full hover:bg-muted transition-colors">
              <Phone className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "about"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              activeTab === "reviews"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reviews
            {activeTab === "reviews" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "about" ? (
          <div className="space-y-6">
            {/* Bio */}
            {provider.bio && (
              <p className="text-foreground text-sm leading-relaxed">
                {provider.bio}
              </p>
            )}

            {/* Services Offered */}
            {provider.skills && provider.skills.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3">Services Offered</h3>
                <ul className="space-y-2">
                  {provider.skills.map((skill: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Service Areas */}
            {provider.service_areas && provider.service_areas.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.service_areas.map((area: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {provider.languages && provider.languages.length > 0 && (
              <div>
                <h3 className="font-bold text-foreground mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.languages.map((language: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Reviews will be displayed here</p>
          </div>
        )}
      </main>

      {/* Sticky CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleBookNow}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl text-base"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProviderProfile;