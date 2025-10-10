import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Euro, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CompletedJob {
  id: string;
  requested_date: string;
  total_final: number;
  overtime_minutes: number;
  completed_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  customer_addresses: {
    rua: string;
    localidade: string;
  };
  cleaning_packages: {
    time_included: string;
  };
}

const CompletedJobsList = () => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const fetchCompletedJobs = async () => {
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
          customer_addresses:address_id(rua, localidade),
          cleaning_packages:package_id(time_included)
        `)
        .eq("provider_id", providerProfile.id)
        .eq("job_status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;
      setCompletedJobs(data || []);
    } catch (error) {
      console.error("Error fetching completed jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load completed jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const calculateEarnings = (total: number) => {
    return (total * 0.85).toFixed(2);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (completedJobs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No completed jobs yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {completedJobs.map((job) => (
        <Card key={job.id} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <AvatarDisplay 
                userId={job.customer_id}
                size={56}
                fallbackText={getInitials(job.profiles.first_name, job.profiles.last_name)}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {job.profiles.first_name} {job.profiles.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {job.customer_addresses.localidade}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>

            {/* Job Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(new Date(job.requested_date), "MMM dd, yyyy")}</span>
                </div>
                <span className="text-muted-foreground">
                  {job.cleaning_packages.time_included}
                  {job.overtime_minutes > 0 && ` +${job.overtime_minutes}min`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Euro className="h-4 w-4 text-green-600" />
                <span className="text-green-600">
                  €{calculateEarnings(job.total_final || 0)} earned
                </span>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/provider/jobs/${job.id}/summary`)}
            >
              View Summary
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompletedJobsList;
