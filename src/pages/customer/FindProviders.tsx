import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { SwipeableProviderCard } from "@/components/provider/SwipeableProviderCard";
import { FilterChips } from "@/components/provider/FilterChips";
import { EmptyProvidersState } from "@/components/provider/EmptyProvidersState";
import { Skeleton } from "@/components/ui/skeleton";
import { ProviderCardSkeletonList } from "@/components/skeletons/ProviderCardSkeleton";
import { useI18n } from "@/contexts/I18nContext";
import { useIsMobile } from "@/hooks/use-mobile";

const FindProviders = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  
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
      toast.error(t.bookings.failedToLoad);
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
      toast.error(t.bookings.failedToLoad);
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
    setSheetOpen(false);
  };

  const handlePullToRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProviders();
      toast.success("Providers refreshed");
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const toggleQuickFilter = (type: "verified" | "rating" | "location") => {
    switch (type) {
      case "verified":
        setVerifiedOnly(!verifiedOnly);
        break;
      case "rating":
        setMinRating(minRating[0] > 0 ? [0] : [4.0]);
        break;
      case "location":
        // Toggle location filter - for now just clears it
        setServiceAreaFilter(serviceAreaFilter ? "" : "Lisbon");
        break;
    }
  };

  const hasActiveFilters = verifiedOnly || minRating[0] > 0 || Boolean(serviceAreaFilter) || Boolean(selectedDate);
  const activeFilterCount = [verifiedOnly, minRating[0] > 0, Boolean(serviceAreaFilter), Boolean(selectedDate)].filter(Boolean).length;

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
                <h1 className="text-base md:text-lg font-bold">{t.providers.findProviders}</h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {t.common.loading}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="mobile-container py-6">
          <ProviderCardSkeletonList count={3} />
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
              <h1 className="text-base md:text-lg font-bold">{t.providers.findProviders}</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {filteredProviders.length} {filteredProviders.length === 1 ? t.providers.provider : t.providers.providersAvailable}
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
                placeholder={t.providers.findNearYou}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 touch-target text-sm"
              />
            </div>
            
            {/* Filter Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="touch-target flex-shrink-0">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] p-0">
                <SheetHeader className="p-6 pb-4 border-b sticky top-0 bg-background z-10">
                  <SheetTitle className="text-lg font-semibold">{t.providers.filterProviders}</SheetTitle>
                  <SheetDescription className="text-sm">{t.providers.narrowSearch}</SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 py-4 px-6 overflow-y-auto max-h-[calc(85vh-180px)]">
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="verified" className="text-sm font-medium">{t.providers.verifiedOnly}</Label>
                    <Switch id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} className="touch-manipulation" />
                  </div>

                  <div className="space-y-3 py-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-medium">{t.providers.minimumRating}</Label>
                      <span className="text-sm font-semibold text-primary">{minRating[0]}.0+</span>
                    </div>
                    <Slider value={minRating} onValueChange={setMinRating} max={5} step={1} className="w-full touch-manipulation" />
                  </div>

                  <div className="space-y-2 py-2">
                    <Label htmlFor="area" className="text-sm font-medium">{t.providers.whereNeedService}</Label>
                    <Input id="area" placeholder={t.providers.enterCity} value={serviceAreaFilter} onChange={(e) => setServiceAreaFilter(e.target.value)} className="h-11 touch-manipulation" />
                  </div>

                  <div className="space-y-2 py-2">
                    <Label htmlFor="date" className="text-sm font-medium">{t.providers.checkAvailability}</Label>
                    <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="h-11 touch-manipulation" />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-background border-t p-6 flex gap-3">
                  <Button variant="outline" onClick={clearFilters} className="flex-1 h-11 touch-manipulation active:scale-95">{t.providers.resetFilters}</Button>
                  <Button onClick={() => {}} className="flex-1 h-11 touch-manipulation active:scale-95">Apply</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filter Indicators */}
          {(verifiedOnly || minRating[0] > 0 || serviceAreaFilter || selectedDate) && (
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-muted-foreground">{t.providers.activeFilters}</span>
              {verifiedOnly && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {t.providers.verified}
                </span>
              )}
              {minRating[0] > 0 && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {minRating[0]}+ {t.providers.stars}
                </span>
              )}
              {serviceAreaFilter && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {t.providers.area} {serviceAreaFilter}
                </span>
              )}
              {selectedDate && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {t.providers.date} {new Date(selectedDate).toLocaleDateString()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Provider List */}
        <div className="space-y-5 pb-24">
          {filteredProviders.length === 0 ? (
            <EmptyProvidersState
              hasFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              searchQuery={searchQuery}
            />
          ) : (
            filteredProviders.map((provider) => (
              <SwipeableProviderCard
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
                createdAt={provider.created_at}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FindProviders;
