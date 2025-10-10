import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import JobStatusBar from "./JobStatusBar";
import AvatarDisplay from "@/components/AvatarDisplay";

interface ConfirmedJob {
  id: string;
  requested_date: string;
  requested_time: string;
  job_status: string;
  customer_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  customer_addresses: {
    rua: string;
    localidade: string;
  };
}

const ConfirmedJobsList = () => {
  const [confirmedJobs, setConfirmedJobs] = useState<ConfirmedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchConfirmedJobs();
  }, []);

  const fetchConfirmedJobs = async () => {
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
          customer_addresses:address_id(rua, localidade, codigo_postal)
        `)
        .eq("provider_id", providerProfile.id)
        .in("job_status", ["confirmed", "on_the_way", "arrived", "started"])
        .order("requested_date", { ascending: true });

      if (error) throw error;
      setConfirmedJobs(data || []);
    } catch (error) {
      console.error("Error fetching confirmed jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load confirmed jobs",
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
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (confirmedJobs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No confirmed jobs</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {confirmedJobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            {/* Customer Info */}
            <div className="flex items-center gap-3 mb-4">
              <AvatarDisplay 
                userId={job.customer_id}
                size={40}
                fallbackText={getInitials(job.profiles.first_name, job.profiles.last_name)}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {job.profiles.first_name} {job.profiles.last_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(job.requested_date), "MMM dd")}</span>
                  <Clock className="h-3 w-3 ml-2" />
                  <span>{job.requested_time}</span>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <JobStatusBar currentStatus={job.job_status} />

            {/* Address */}
            <div className="flex items-center gap-2 text-sm mt-4 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">
                {job.customer_addresses.rua}, {job.customer_addresses.localidade}
              </span>
            </div>

            {/* Action */}
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/provider/jobs/${job.id}`)}
            >
              View Job
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConfirmedJobsList;
