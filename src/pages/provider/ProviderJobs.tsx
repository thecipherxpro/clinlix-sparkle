import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Calendar, User, ArrowLeft, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { toast } from "sonner";
import ProviderMobileNav from "@/components/ProviderMobileNav";

const ProviderJobs = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchBookings();
  }, []);

  const checkUserAndFetchBookings = async () => {
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

      // Get provider profile
      const { data: providerData } = await supabase
        .from('provider_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProviderProfile(providerData);

      if (providerData) {
        // Fetch bookings assigned to this provider
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select(`
            *,
            customer:profiles!customer_id(first_name, last_name, phone, email),
            address:customer_addresses(street, rua, city, localidade, postal_code, codigo_postal),
            package:cleaning_packages(package_name, time_included)
          `)
          .eq('provider_id', providerData.id)
          .order('requested_date', { ascending: true });

        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;

      toast.success(`Booking ${status}`);
      checkUserAndFetchBookings();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to update booking");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'in_progress': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const activeBookings = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status));
  const completedBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-20">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/provider/dashboard')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">My Jobs</h1>
              <p className="text-sm text-muted-foreground">Manage your bookings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="text-sm">
              Active ({activeBookings.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              History ({completedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeBookings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No active jobs</p>
                </CardContent>
              </Card>
            ) : (
              activeBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2">
                          {booking.package?.package_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{booking.customer?.first_name} {booking.customer?.last_name}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span>{new Date(booking.requested_date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                      <span>{booking.requested_time}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {booking.address?.street || booking.address?.rua}, {booking.address?.city || booking.address?.localidade}
                      </span>
                    </div>
                    <div className="pt-3 flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="flex-1 touch-target"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="flex-1 touch-target"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                          className="w-full touch-target"
                        >
                          Start Job
                        </Button>
                      )}
                      {booking.status === 'in_progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="w-full touch-target"
                        >
                          Complete Job
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {completedBookings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No completed jobs yet</p>
                </CardContent>
              </Card>
            ) : (
              completedBookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base mb-2">
                          {booking.package?.package_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{booking.customer?.first_name} {booking.customer?.last_name}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(booking.requested_date).toLocaleDateString()}</span>
                      <Clock className="w-4 h-4 flex-shrink-0 ml-2" />
                      <span>{booking.requested_time}</span>
                    </div>
                    {booking.status === 'completed' && booking.total_final && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-lg font-semibold">
                          €{Number(booking.total_final).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderJobs;
