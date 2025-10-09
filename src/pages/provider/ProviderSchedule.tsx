import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import ProviderMobileNav from "@/components/ProviderMobileNav";

const ProviderSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState<any>(null);

  useEffect(() => {
    checkUserAndFetchAvailability();
  }, []);

  const checkUserAndFetchAvailability = async () => {
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
        const { data: availabilityData } = await supabase
          .from('provider_availability')
          .select('*')
          .eq('provider_id', providerData.id)
          .order('date', { ascending: true });

        setAvailability(availabilityData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-xl font-bold">My Schedule</h1>
              <p className="text-sm text-muted-foreground">Manage your availability</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Calendar</CardTitle>
            <CardDescription>Select dates to manage your availability</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Available Slots</CardTitle>
                <CardDescription>
                  {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
                </CardDescription>
              </div>
              <Button size="sm" className="touch-target">
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availability.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No availability slots added yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your available time slots to receive bookings
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availability
                  .filter(slot => 
                    selectedDate && 
                    new Date(slot.date).toDateString() === selectedDate.toDateString()
                  )
                  .map((slot) => (
                    <div 
                      key={slot.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{slot.start_time} - {slot.end_time}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(slot.date).toLocaleDateString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="touch-target">
                        Remove
                      </Button>
                    </div>
                  ))}
                {selectedDate && availability.filter(slot => 
                  new Date(slot.date).toDateString() === selectedDate.toDateString()
                ).length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No slots for this date
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderSchedule;
