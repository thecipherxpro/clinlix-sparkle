import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star, Sparkles, Shield } from "lucide-react";
import MobileNav from "@/components/MobileNav";
import AvatarDisplay from "@/components/AvatarDisplay";

const Providers = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkAuthAndFetchProviders();
  }, []);

  const checkAuthAndFetchProviders = async () => {
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

      // Fetch providers
      const { data: providersData } = await supabase
        .from('provider_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setProviders(providersData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredProviders = providers.filter(provider =>
    provider.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 safe-top">
        <div className="mobile-container py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customer/dashboard')} className="touch-target">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Providers
          </h1>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-8 max-w-6xl">
        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Search providers..."
              className="pl-10 sm:pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Providers List */}
        {filteredProviders.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-8 pb-8 sm:pt-12 sm:pb-12 text-center">
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                No providers found yet
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Check back soon as we onboard more cleaning professionals
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="border-0 shadow-sm hover:shadow-lg transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <AvatarDisplay 
                      userId={provider.user_id}
                      avatarUrl={provider.photo_url}
                      size={64}
                      fallbackText={getInitials(provider.full_name)}
                      className="border-2 border-primary/20 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{provider.full_name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-foreground">
                              {provider.rating_avg.toFixed(1)}
                            </span>
                            <span>({provider.rating_count})</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
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
                      </div>
                      {provider.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {provider.bio}
                        </p>
                      )}
                      {provider.skills && provider.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {provider.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/providers/profile/${provider.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate('/customer/booking')}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Providers;
