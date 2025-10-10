import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  Package,
  Phone,
  Mail,
  Navigation,
  Euro,
  AlertCircle
} from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    email: string;
  };
  customer_addresses: {
    rua: string;
    porta_andar: string | null;
    localidade: string;
    codigo_postal: string;
    property_type: string;
    country: string;
  };
  cleaning_packages: {
    package_name: string;
    time_included: string;
    bedroom_count: number;
    areas_included: string[];
  };
}

interface Addon {
  id: string;
  name_en: string;
  price: number;
}

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJobDetail();
      fetchAddons();
    }
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          profiles:customer_id(first_name, last_name, phone, email),
          customer_addresses:address_id(rua, porta_andar, localidade, codigo_postal, property_type, country),
          cleaning_packages:package_id(package_name, time_included, bedroom_count, areas_included)
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

      fetchJobDetail();
      setShowAcceptDialog(false);
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

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "??";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const openInMaps = () => {
    if (!job) return;
    const address = `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}, ${job.customer_addresses.codigo_postal}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, "_blank");
  };

  const getJobAddons = () => {
    if (!job?.addon_ids || job.addon_ids.length === 0) return [];
    return addons.filter(addon => job.addon_ids!.includes(addon.id));
  };

  const calculateTotalWithAddons = () => {
    if (!job) return 0;
    const jobAddons = getJobAddons();
    const addonsTotal = jobAddons.reduce((sum, addon) => sum + Number(addon.price), 0);
    return job.total_estimate + addonsTotal;
  };

  const isJobConfirmed = job?.job_status !== "pending" && job?.job_status !== "declined";

  const serviceIcons: Record<string, string> = {
    bathroom: "🛁",
    kitchen: "🍽️",
    livingroom: "🛋️",
    floors: "🧹",
    dusting: "🧼",
    surfaces: "✨",
    vacuuming: "🧹"
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

  const totalWithAddons = calculateTotalWithAddons();
  const earnings = (totalWithAddons * 0.85).toFixed(2);
  const platformFee = (totalWithAddons * 0.15).toFixed(2);
  const jobAddons = getJobAddons();

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
        {/* Customer Card with Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-lg font-semibold">
                  {getInitials(job.profiles?.first_name, job.profiles?.last_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  {job.profiles?.first_name || "Customer"} {job.profiles?.last_name || ""}
                </h2>
                <Badge variant="outline" className="mt-1">
                  Booking #{job.id.slice(0, 8)}
                </Badge>
              </div>
              {/* Contact Icons - Only shown when confirmed */}
              {isJobConfirmed && (
                <div className="flex gap-2">
                  {job.profiles?.phone && (
                    <a href={`tel:${job.profiles.phone}`}>
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {job.profiles?.email && (
                    <a href={`mailto:${job.profiles.email}`}>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Status Bar for Confirmed Jobs */}
            {isJobConfirmed && (
              <JobStatusBar currentStatus={job.job_status} />
            )}
          </CardContent>
        </Card>

        {/* Tabbed Interface */}
        <Tabs defaultValue="when" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="when">
              <Clock className="h-4 w-4 mr-2" />
              When
            </TabsTrigger>
            <TabsTrigger value="where">
              <MapPin className="h-4 w-4 mr-2" />
              Where
            </TabsTrigger>
          </TabsList>

          {/* WHEN TAB */}
          <TabsContent value="when" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
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
                    <p className="font-medium">Start Time</p>
                    <p className="text-sm text-muted-foreground">{job.requested_time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Cleaning Duration</p>
                    <p className="text-sm text-muted-foreground">
                      Up to {job.cleaning_packages?.time_included || "N/A"}
                    </p>
                  </div>
                </div>

                {jobAddons.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="font-medium mb-2">Add-ons</p>
                    <div className="space-y-1">
                      {jobAddons.map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{addon.name_en}</span>
                          <span className="font-medium">€{Number(addon.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Earnings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Euro className="h-5 w-5" />
                  Estimated Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span className="font-medium">€{job.total_estimate.toFixed(2)}</span>
                </div>
                {jobAddons.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Add-ons</span>
                    <span className="font-medium">
                      €{jobAddons.reduce((sum, a) => sum + Number(a.price), 0).toFixed(2)}
                    </span>
                  </div>
                )}
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

            {/* Overtime Rule Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Overtime Rule:</strong> €10 per 30 minutes extra if job exceeds estimated time
              </AlertDescription>
            </Alert>

            {/* Timer for Started Jobs */}
            {job.job_status === "started" && job.started_at && job.cleaning_packages?.time_included && (
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
                    className="w-full h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    size="lg"
                    onClick={() => setShowAcceptDialog(true)}
                  >
                    Accept Job
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    size="lg"
                    onClick={() => setShowDeclineDialog(true)}
                  >
                    Decline
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
                  onClick={() => updateJobStatus("completed")}
                >
                  Complete Job
                </Button>
              )}
            </div>
          </TabsContent>

          {/* WHERE TAB */}
          <TabsContent value="where" className="space-y-4 mt-4">
            {/* Customer Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">
                    {job.profiles?.first_name || "Customer"} {job.profiles?.last_name || ""}
                  </p>
                </div>

                {isJobConfirmed ? (
                  <>
                    {job.profiles?.phone && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                        <p className="font-medium">{job.profiles.phone}</p>
                      </div>
                    )}
                    {job.profiles?.email && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email</p>
                        <p className="font-medium">{job.profiles.email}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Contact details will be revealed after accepting the job
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Country</p>
                  <p className="font-medium">{job.customer_addresses?.country || "Portugal"} 🇵🇹</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">
                    {job.customer_addresses?.rua || "Address not available"}
                    {job.customer_addresses?.porta_andar && `, ${job.customer_addresses.porta_andar}`}
                    <br />
                    {job.customer_addresses?.codigo_postal}, {job.customer_addresses?.localidade}
                  </p>
                </div>

                {isJobConfirmed && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={openInMaps}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Property Type</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {job.customer_addresses?.property_type || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Layout</p>
                    <p className="text-sm text-muted-foreground">
                      {job.cleaning_packages?.bedroom_count || 0} Bedrooms
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-3">Included Services</p>
                  <div className="grid grid-cols-2 gap-2">
                    {job.cleaning_packages?.areas_included?.map((area) => (
                      <div key={area} className="flex items-center gap-2 text-sm">
                        <span className="text-lg">{serviceIcons[area] || "✓"}</span>
                        <span className="capitalize">{area.replace("_", " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this job?</AlertDialogTitle>
            <AlertDialogDescription>
              You will earn €{earnings} for this {job.cleaning_packages?.time_included || "cleaning"} job.
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
