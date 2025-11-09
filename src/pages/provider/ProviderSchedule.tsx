import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { DateScroller } from "@/components/provider/DateScroller";
import { TimeSlotCard } from "@/components/provider/TimeSlotCard";
import { AddAvailabilityDrawer } from "@/components/provider/AddAvailabilityDrawer";
import { useI18n } from "@/contexts/I18nContext";

const ProviderSchedule = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);

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
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        const { data: availabilityData } = await supabase
          .from('provider_availability')
          .select('*')
          .eq('provider_id', providerData.id)
          .gte('date', today.toISOString().split('T')[0])
          .lte('date', thirtyDaysLater.toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('start_time', { ascending: true });

        setAvailability(availabilityData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  const checkOverlap = (newStart: string, newEnd: string, date: string) => {
    const slotsForDate = availability.filter(
      slot => slot.date === date
    );

    for (const slot of slotsForDate) {
      // Check if new slot overlaps with existing slot
      if (
        (newStart >= slot.start_time && newStart < slot.end_time) ||
        (newEnd > slot.start_time && newEnd <= slot.end_time) ||
        (newStart <= slot.start_time && newEnd >= slot.end_time)
      ) {
        return true;
      }
    }
    return false;
  };

  const handleAddSlot = async (startTime: string, endTime: string) => {
    if (!providerProfile) return;

    const dateString = selectedDate.toISOString().split('T')[0];

    // Check for overlaps
    if (checkOverlap(startTime, endTime, dateString)) {
      toast.error("This time overlaps with an existing slot");
      throw new Error("Overlap detected");
    }

    try {
      const { error } = await supabase
        .from('provider_availability')
        .insert({
          provider_id: providerProfile.id,
          date: dateString,
          start_time: startTime,
          end_time: endTime
        });

      if (error) {
        if (error.message.includes('unique_availability')) {
          toast.error("This time slot already exists");
        } else if (error.message.includes('check_time_range')) {
          toast.error("Time must be between 7:00 AM and 7:00 PM");
        } else {
          throw error;
        }
        throw error;
      }

      toast.success("Availability added successfully");
      
      // Refresh availability data
      await checkUserAndFetchAvailability();
    } catch (error) {
      console.error('Error adding slot:', error);
      throw error;
    }
  };

  const handleRemoveSlot = async (slotId: string) => {
    try {
      const { error } = await supabase
        .from('provider_availability')
        .delete()
        .eq('id', slotId);

      if (error) throw error;

      toast.success("Slot removed");
      setAvailability(availability.filter(slot => slot.id !== slotId));
    } catch (error) {
      console.error('Error removing slot:', error);
      toast.error("Failed to remove slot");
    }
  };

  // Get dates that have slots
  const datesWithSlots = useMemo(() => {
    return new Set(availability.map(slot => slot.date));
  }, [availability]);

  // Get slots for selected date
  const slotsForSelectedDate = useMemo(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    return availability.filter(slot => slot.date === dateString);
  }, [availability, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      <header className="bg-card/50 backdrop-blur-sm sticky top-0 z-10 border-b safe-top">
        <div className="mobile-container py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/provider/dashboard')} 
                className="touch-target"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-base sm:text-lg font-bold">{t.provider.mySchedule}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {t.provider.addEditSlots}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setIsAddDrawerOpen(true)}
              className="touch-target"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t.provider.add}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mobile-container py-4 sm:py-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Date Scroller */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {t.provider.next30Days}
            </CardTitle>
            <CardDescription className="text-xs">
              {t.provider.selectDateToManage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DateScroller
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              datesWithSlots={datesWithSlots}
            />
          </CardContent>
        </Card>

        {/* Time Slots */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </CardTitle>
            <CardDescription className="text-xs">
              {slotsForSelectedDate.length} {slotsForSelectedDate.length !== 1 ? t.provider.slotsAvailable : t.provider.slotAvailable}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {slotsForSelectedDate.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <CalendarIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium mb-1">
                  {t.provider.noAvailabilitySet}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.provider.addAvailableSlots}
                </p>
                <Button onClick={() => setIsAddDrawerOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t.provider.addAvailability}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {slotsForSelectedDate.map((slot) => (
                  <TimeSlotCard
                    key={slot.id}
                    startTime={slot.start_time}
                    endTime={slot.end_time}
                    onDelete={() => handleRemoveSlot(slot.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddAvailabilityDrawer
        open={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        selectedDate={selectedDate}
        onAdd={handleAddSlot}
      />
    </div>
  );
};

export default ProviderSchedule;
