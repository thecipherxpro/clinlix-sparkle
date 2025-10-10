import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AddAvailabilityDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  onAdd: (startTime: string, endTime: string) => Promise<void>;
}

export function AddAvailabilityDrawer({ 
  open, 
  onOpenChange, 
  selectedDate,
  onAdd 
}: AddAvailabilityDrawerProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 19; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 19 && minute > 0) break; // Stop at 7:00 PM
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push({ value: time, label });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = async () => {
    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Validate 7 AM - 7 PM range
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);

    if (startHour < 7 || endHour > 19 || (endHour === 19 && endMinute > 0)) {
      toast.error("Time must be between 7:00 AM and 7:00 PM");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(startTime, endTime);
      setStartTime("09:00");
      setEndTime("12:00");
      onOpenChange(false);
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] sm:h-auto">
        <SheetHeader>
          <SheetTitle>Add Availability</SheetTitle>
          <SheetDescription>
            Set your available hours for {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger id="start-time" className="touch-target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger id="end-time" className="touch-target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              ⏰ Availability hours must be between 7:00 AM and 7:00 PM
            </p>
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 touch-target"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 touch-target"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
