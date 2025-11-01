import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Car, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const ProviderProfile = () => {
  const {
    providerId
  } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllSpecializations, setShowAllSpecializations] = useState(false);
  useEffect(() => {
    fetchProviderData();
  }, [providerId]);
  const fetchProviderData = async () => {
    try {
      const {
        data: providerData
      } = await supabase.from("provider_profiles").select("*").eq("id", providerId).single();
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
    return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>;
  }
  if (!provider) {
    return <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Provider not found</p>
      </div>;
  }
  const displayedSpecializations = showAllSpecializations 
    ? provider.skills 
    : provider.skills?.slice(0, 3);

  return <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Provider Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Profile Header */}
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 rounded-xl">
            <AvatarImage src={provider.photo_url} alt={provider.full_name} />
            <AvatarFallback className="rounded-xl bg-gray-200 text-gray-600 text-lg font-semibold">
              {provider.full_name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{provider.full_name}</h2>
            <p className="text-sm text-gray-500">License #{provider.id?.slice(0, 6) || '123456'}</p>
            <div className="flex gap-2 mt-2">
              {provider.verified && (
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded-md">
                  Verified
                </span>
              )}
              {provider.skills && provider.skills[0] && (
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-md">
                  {provider.skills[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Availability & Experience */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Available Today</p>
              <p className="text-sm text-gray-600 mb-2">9:00 AM - 5:00 PM</p>
              <span className="inline-block px-3 py-1 bg-teal-500 text-white text-xs font-medium rounded-md">
                ALL TIMING
              </span>
            </CardContent>
          </Card>

          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Experience</p>
              <p className="text-2xl font-bold text-gray-900">{provider.experience_years || 1} yrs</p>
              <p className="text-sm text-gray-600">Professional</p>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-gray-200 overflow-hidden">
          <CardContent className="p-0 h-32 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-teal-300/50" />
            </div>
          </CardContent>
        </Card>

        {/* Service Area */}
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {provider.service_areas?.[0] || 'Greater Toronto Area'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {provider.service_areas?.join(', ') || 'North York, Scarborough, Brampton, Vaughan, Toronto, Mississauga, Richmond Hill, Markham'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commute */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Commute</h3>
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Car</h4>
                  <p className="text-sm text-gray-600">Owns a car</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specializations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-gray-900">Specializations</h3>
            {provider.skills && provider.skills.length > 3 && (
              <button 
                onClick={() => setShowAllSpecializations(!showAllSpecializations)}
                className="text-sm text-blue-600 font-medium"
              >
                {showAllSpecializations ? 'SHOW LESS' : 'SEE ALL'}
              </button>
            )}
          </div>
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <ul className="space-y-2">
                {displayedSpecializations?.map((skill: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        {provider.bio && (
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">About</h3>
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <Button 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>;
};
export default ProviderProfile;