import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Euro } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface JobRequest {
  id: string;
  requested_date: string;
  requested_time: string;
  total_estimate: number;
  customer_id: string;
  address_id: string;
  package_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  customer_addresses: {
    rua: string;
    localidade: string;
    codigo_postal: string;
  };
  cleaning_packages: {
    package_name: string;
    time_included: string;
  };
}

const JobRequestsList = () => {
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobRequests();
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
          customer_addresses:address_id(rua, localidade, codigo_postal),
          cleaning_packages:package_id(package_name, time_included)
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
    <div className="p-4 space-y-4">
      {jobRequests.map((job) => (
        <Card 
          key={job.id} 
          className="animate-fade-in hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4">
            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(job.profiles.first_name, job.profiles.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">
                  {job.profiles.first_name} {job.profiles.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {job.cleaning_packages.package_name}
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(job.requested_date), "MMM dd, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{job.requested_time} • {job.cleaning_packages.time_included}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {job.customer_addresses.rua}, {job.customer_addresses.localidade}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Euro className="h-4 w-4 text-primary" />
                <span>€{(job.total_estimate * 0.85).toFixed(2)} (after 15% fee)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/provider/jobs/${job.id}`)}
              >
                View Job
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/provider/jobs/${job.id}`)}
              >
                Accept
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobRequestsList;
