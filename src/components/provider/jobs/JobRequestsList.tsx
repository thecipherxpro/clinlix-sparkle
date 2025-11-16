import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AvatarDisplay from "@/components/AvatarDisplay";
import { QuickAcceptRejectDialog } from "@/components/provider/QuickAcceptRejectDialog";

interface JobRequest {
  id: string;
  requested_date: string;
  requested_time: string;
  total_estimate: number;
  customer_id: string;
  address_id: string;
  package_id: string;
  addon_ids: string[] | null;
  profiles: {
    first_name: string;
    last_name: string;
  };
  customer_addresses: {
    rua: string;
    localidade: string;
    codigo_postal: string;
    property_type: string;
    country: string;
  };
  cleaning_packages: {
    package_name: string;
    time_included: string;
    bedroom_count: number;
  };
}

interface Addon {
  id: string;
  name_en: string;
  price: number;
}

const JobRequestsList = () => {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"accept" | "reject">("accept");
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [selectedEarnings, setSelectedEarnings] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobRequests();
    fetchAddons();
  }, []);

  const fetchJobRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: providerProfile } = await supabase
        .from("provider_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!providerProfile) return;

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:customer_id(first_name, last_name),
          customer_addresses:address_id(rua, localidade, codigo_postal, property_type, country),
          cleaning_packages:package_id(package_name, time_included, bedroom_count)
        `)
        .eq("provider_id", providerProfile.id)
        .eq("job_status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobRequests(data || []);
    } catch (error) {
      console.error("Error fetching job requests:", error);
      toast({
        title: "Error",
        description: "Failed to load job requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddons = async () => {
    try {
      const { data, error } = await supabase
        .from("cleaning_addons")
        .select("id, name_en, price");

      if (error) throw error;
      setAddons(data || []);
    } catch (error) {
      console.error("Error fetching addons:", error);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "??";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getJobAddons = (addonIds: string[] | null) => {
    if (!addonIds || addonIds.length === 0) return [];
    return addons.filter(addon => addonIds.includes(addon.id));
  };

  const calculateTotalWithAddons = (basePrice: number, addonIds: string[] | null) => {
    const jobAddons = getJobAddons(addonIds);
    const addonsTotal = jobAddons.reduce((sum, addon) => sum + Number(addon.price), 0);
    return basePrice + addonsTotal;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (jobRequests.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No pending job requests</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 space-y-4">
        {jobRequests.map((job) => {
        const jobAddons = getJobAddons(job.addon_ids);
        const totalWithAddons = calculateTotalWithAddons(job.total_estimate, job.addon_ids);
        const providerEarnings = (totalWithAddons * 0.85).toFixed(2);

        return (
          <Card 
            key={job.id} 
            className="animate-fade-in hover:shadow-lg transition-all duration-300 border-2"
          >
            <CardContent className="p-5">
              {/* Header: Customer Info */}
              <div className="flex items-center gap-4 mb-4">
                <AvatarDisplay 
                  userId={job.customer_id}
                  size={56}
                  fallbackText={getInitials(job.profiles?.first_name, job.profiles?.last_name)}
                  className="border-2 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">
                    {job.profiles?.first_name || "Customer"} {job.profiles?.last_name || ""}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(job.requested_date), "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {job.customer_addresses?.localidade || "City"}, {job.customer_addresses?.country || "Portugal"}
                </span>
              </div>

              {/* Property Info */}
              <div className="text-sm text-muted-foreground mb-3">
                <span className="capitalize">{job.customer_addresses?.property_type || "Property"}</span>
                {" • "}
                <span>{job.cleaning_packages?.bedroom_count || 0} Bedrooms</span>
              </div>

              {/* Add-ons */}
              {jobAddons.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground">
                    {jobAddons.map((addon, idx) => (
                      <span key={addon.id}>
                        + {addon.name_en}
                        {idx < jobAddons.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="bg-muted/50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted-foreground">Base Price</span>
                  <span className="font-medium">€{job.total_estimate.toFixed(2)}</span>
                </div>
                {jobAddons.length > 0 && (
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-muted-foreground">Add-ons</span>
                    <span className="font-medium">
                      €{jobAddons.reduce((sum, a) => sum + Number(a.price), 0).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-2 mt-2 flex justify-between items-center">
                  <span className="font-semibold">Estimated Earnings</span>
                  <span className="font-bold text-lg text-primary">€{providerEarnings}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate(`/provider/jobs/${job.id}`)}
                >
                  View Details
                </Button>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setSelectedBookingId(job.id);
                    setSelectedEarnings(providerEarnings);
                    setSelectedTime(job.requested_time);
                    setDialogMode("accept");
                    setDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                onClick={() => {
                  setSelectedBookingId(job.id);
                  setDialogMode("reject");
                  setDialogOpen(true);
                }}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Decline
              </Button>
            </CardContent>
          </Card>
        );
        })}
      </div>

      <QuickAcceptRejectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bookingId={selectedBookingId}
        mode={dialogMode}
        earnings={selectedEarnings}
        serviceTime={selectedTime}
        onSuccess={fetchJobRequests}
      />
    </>
  );
};

export default JobRequestsList;
