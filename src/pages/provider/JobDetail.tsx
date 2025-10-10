import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Clock, MapPin, Home, Package, Euro, FileText, Navigation } from "lucide-react";
import { format } from "date-fns";
import JobStatusBar from "@/components/provider/jobs/JobStatusBar";
import JobTimer from "@/components/provider/jobs/JobTimer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JobDetail {
  id: string;
  requested_date: string;
  requested_time: string;
  total_estimate: number;
  total_final: number | null;
  job_status: string;
  started_at: string | null;
  overtime_minutes: number;
  addon_ids: string[] | null;
  profiles: {
    first_name: string;
    last_name: string;
    phone: string | null;
  };
  customer_addresses: {
    rua: string;
    porta_andar: string | null;
    localidade: string;
    codigo_postal: string;
    property_type: string;
  };
  cleaning_packages: {
    package_name: string;
    time_included: string;
  };
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  useEffect(() => {
    if (id) fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:customer_id(first_name, last_name, phone),
          customer_addresses:address_id(rua, porta_andar, localidade, codigo_postal, property_type),
          cleaning_packages:package_id(package_name, time_included)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job detail:", error);
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          job_status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Job Accepted",
        description: "The job has been confirmed successfully",
      });

      navigate("/provider/jobs");
    } catch (error) {
      console.error("Error accepting job:", error);
      toast({
        title: "Error",
        description: "Failed to accept job",
        variant: "destructive",
      });
    }
  };

  const handleDeclineJob = async () => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ job_status: "declined" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Job Declined",
        description: "You have declined this job request",
      });

      navigate("/provider/jobs");
    } catch (error) {
      console.error("Error declining job:", error);
      toast({
        title: "Error",
        description: "Failed to decline job",
        variant: "destructive",
      });
    }
  };

  const updateJobStatus = async (newStatus: string) => {
    try {
      const updates: any = { job_status: newStatus };

      if (newStatus === "started") {
        updates.started_at = new Date().toISOString();
      } else if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
        updates.total_final = job?.total_estimate;
      }

      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Job status updated to ${newStatus.replace("_", " ")}`,
      });

      fetchJobDetail();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const openInMaps = () => {
    if (!job) return;
    const address = `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}, ${job.customer_addresses.codigo_postal}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-20 bg-muted"></div>
        <div className="p-6 space-y-4">
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-60 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const earnings = (job.total_estimate * 0.85).toFixed(2);
  const platformFee = (job.total_estimate * 0.15).toFixed(2);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/provider/jobs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Job Details</h1>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {/* Customer Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(job.profiles.first_name, job.profiles.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">
                  {job.profiles.first_name} {job.profiles.last_name}
                </h2>
                {job.profiles.phone && (
                  <p className="text-sm text-muted-foreground">{job.profiles.phone}</p>
                )}
                <Badge variant="outline" className="mt-1">
                  Booking #{job.id.slice(0, 8)}
                </Badge>
              </div>
            </div>

            {/* Status Bar for Confirmed Jobs */}
            {job.job_status !== "pending" && job.job_status !== "declined" && (
              <JobStatusBar currentStatus={job.job_status} />
            )}
          </CardContent>
        </Card>

        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.requested_date), "EEEE, MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-sm text-muted-foreground">
                  {job.requested_time} • {job.cleaning_packages.time_included}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {job.customer_addresses.rua}
                  {job.customer_addresses.porta_andar && `, ${job.customer_addresses.porta_andar}`}
                  <br />
                  {job.customer_addresses.localidade}, {job.customer_addresses.codigo_postal}
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto mt-1"
                  onClick={openInMaps}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Open in Maps
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Property Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {job.customer_addresses.property_type}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Cleaning Package</p>
                <p className="text-sm text-muted-foreground">
                  {job.cleaning_packages.package_name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estimated Earnings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Base Amount</span>
              <span className="font-medium">€{job.total_estimate.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Platform Fee (15%)</span>
              <span className="font-medium text-red-600">-€{platformFee}</span>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Your Earnings</span>
              <span className="font-bold text-lg text-green-600">€{earnings}</span>
            </div>
          </CardContent>
        </Card>

        {/* Timer for Started Jobs */}
        {job.job_status === "started" && job.started_at && (
          <JobTimer
            startedAt={job.started_at}
            timeIncluded={job.cleaning_packages.time_included}
            bookingId={job.id}
            overtimeMinutes={job.overtime_minutes}
          />
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {job.job_status === "pending" && (
            <>
              <Button
                className="w-full h-12"
                size="lg"
                onClick={() => setShowAcceptDialog(true)}
              >
                Accept Job
              </Button>
              <Button
                variant="destructive"
                className="w-full h-12"
                size="lg"
                onClick={() => setShowDeclineDialog(true)}
              >
                Decline Job
              </Button>
            </>
          )}

          {job.job_status === "confirmed" && (
            <Button
              className="w-full h-12"
              size="lg"
              onClick={() => updateJobStatus("on_the_way")}
            >
              I'm On the Way
            </Button>
          )}

          {job.job_status === "on_the_way" && (
            <Button
              className="w-full h-12"
              size="lg"
              onClick={() => updateJobStatus("arrived")}
            >
              I've Arrived
            </Button>
          )}

          {job.job_status === "arrived" && (
            <Button
              className="w-full h-12"
              size="lg"
              onClick={() => updateJobStatus("started")}
            >
              Start Job
            </Button>
          )}

          {job.job_status === "started" && (
            <Button
              className="w-full h-12"
              size="lg"
              variant="default"
              onClick={() => updateJobStatus("completed")}
            >
              Complete Job
            </Button>
          )}
        </div>
      </div>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this job?</AlertDialogTitle>
            <AlertDialogDescription>
              You will earn €{earnings} for this {job.cleaning_packages.time_included} cleaning job.
              Make sure you can arrive on time at {job.requested_time}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptJob}>
              Confirm & Accept
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this job?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to decline this job request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeclineJob}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobDetail;
