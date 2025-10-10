import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Search, SlidersHorizontal, UserX } from "lucide-react";
import { toast } from "sonner";
import MobileNav from "@/components/MobileNav";
import ProviderCard from "@/components/ProviderCard";
import { Skeleton } from "@/components/ui/skeleton";

const FindProviders = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState([0]);
  const [serviceAreaFilter, setServiceAreaFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    checkUserAndFetchProviders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [providers, searchQuery, verifiedOnly, minRating, serviceAreaFilter, selectedDate]);

  const checkUserAndFetchProviders = async () => {
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

      if (profileData?.role !== 'customer') {
        navigate('/provider/dashboard');
        return;
      }

      await fetchProviders();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    let query = supabase
      .from('provider_profiles')
      .select('*')
      .order('verified', { ascending: false })
      .order('rating_avg', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching providers:', error);
      toast.error("Failed to fetch providers");
      return;
    }

    setProviders(data || []);
  };

  const applyFilters = () => {
    let filtered = [...providers];

    // Search by name or area
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.full_name.toLowerCase().includes(query) ||
        p.service_areas?.some((area: string) => area.toLowerCase().includes(query))
      );
    }

    // Verified only
    if (verifiedOnly) {
      filtered = filtered.filter(p => p.verified);
    }

    // Min rating
    if (minRating[0] > 0) {
      filtered = filtered.filter(p => p.rating_avg >= minRating[0]);
    }

    // Service area
    if (serviceAreaFilter.trim()) {
      const area = serviceAreaFilter.toLowerCase();
      filtered = filtered.filter(p => 
        p.service_areas?.some((a: string) => a.toLowerCase().includes(area))
      );
    }

    // Date availability (if provided)
    if (selectedDate) {
      // This would require a join with provider_availability
      // For now, we'll keep all providers
    }

    setFilteredProviders(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setVerifiedOnly(false);
    setMinRating([0]);
    setServiceAreaFilter("");
    setSelectedDate("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
        <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
          <div className="mobile-container py-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg md:text-xl font-bold">Find Providers</h1>
                <p className="text-xs md:text-sm text-muted-foreground">Loading...</p>
              </div>
            </div>
          </div>
        </header>
        <main className="mobile-container py-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-0 shadow-sm rounded-xl p-4 bg-card">
              <div className="flex gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg md:text-xl font-bold">Find Providers</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-6 max-w-4xl mx-auto">
        {/* Search Bar & Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Find providers near you..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 touch-target"
              />
            </div>
            
            {/* Filter Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="touch-target flex-shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Providers</SheetTitle>
                  <SheetDescription>
                    Narrow your search
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 py-6">
                  {/* Verified Only */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="verified">Verified Only</Label>
                      <p className="text-xs text-muted-foreground">Show only verified providers</p>
                    </div>
                    <Switch
                      id="verified"
                      checked={verifiedOnly}
                      onCheckedChange={setVerifiedOnly}
                    />
                  </div>

                  {/* Min Rating */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Minimum Rating</Label>
                      <span className="text-sm font-medium">{minRating[0]}.0+</span>
                    </div>
                    <Slider
                      value={minRating}
                      onValueChange={setMinRating}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Service Area */}
                  <div className="space-y-2">
                    <Label htmlFor="area">Where do you need service?</Label>
                    <Input
                      id="area"
                      placeholder="Enter your city"
                      value={serviceAreaFilter}
                      onChange={(e) => setServiceAreaFilter(e.target.value)}
                      className="touch-target"
                    />
                  </div>

                  {/* Availability Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Check Availability</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="touch-target"
                    />
                    <p className="text-xs text-muted-foreground">
                      Filter by availability on a specific date
                    </p>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full touch-target"
                  >
                    Reset Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filter Indicators */}
          {(verifiedOnly || minRating[0] > 0 || serviceAreaFilter || selectedDate) && (
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-muted-foreground">Active filters:</span>
              {verifiedOnly && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
              {minRating[0] > 0 && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {minRating[0]}+ stars
                </span>
              )}
              {serviceAreaFilter && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Area: {serviceAreaFilter}
                </span>
              )}
              {selectedDate && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Date: {new Date(selectedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Provider List */}
        <div className="space-y-4">
          {filteredProviders.length === 0 ? (
            <div className="text-center py-16">
              <UserX className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try different filters or expand your search area
              </p>
              <Button onClick={clearFilters} variant="outline">
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                providerId={provider.id}
                userId={provider.user_id}
                fullName={provider.full_name}
                photoUrl={provider.photo_url}
                verified={provider.verified}
                newProvider={provider.new_provider}
                ratingAvg={provider.rating_avg || 0}
                ratingCount={provider.rating_count || 0}
                serviceAreas={provider.service_areas || []}
                skills={provider.skills || []}
                bio={provider.bio}
                showActions={true}
              />
            ))
          )}
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default FindProviders;
