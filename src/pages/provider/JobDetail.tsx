import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button as HeroButton, Tabs, Tab } from "@heroui/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  AlertCircle,
  Bath,
  UtensilsCrossed,
  Sofa,
  Sparkles,
  Waves
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
import AvatarDisplay from "@/components/AvatarDisplay";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { MessageCircle } from "lucide-react";

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
  customer_id: string;
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
    layout_type: string;
    distrito: string | null;
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
  const [chatOpen, setChatOpen] = useState(false);

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
          customer_addresses:address_id(rua, porta_andar, localidade, codigo_postal, property_type, country, layout_type, distrito),
          cleaning_packages:package_id(package_name, time_included, bedroom_count, areas_included)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive",
        });
        navigate("/provider/jobs");
        return;
      }
      
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

      // Get provider info for email
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: providerProfile } = await supabase
          .from("provider_profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        if (providerProfile && job) {
          const totalWithAddons = calculateTotalWithAddons();
          const currency = job.customer_addresses.country === "Portugal" ? "€" : "$";

          // Send booking accepted email to customer
          await supabase.functions.invoke("send-booking-accepted", {
            body: {
              customerEmail: job.profiles.email,
              customerName: `${job.profiles.first_name} ${job.profiles.last_name}`,
              bookingId: job.id,
              providerName: providerProfile.full_name,
              serviceDate: format(new Date(job.requested_date), "EEEE, MMMM dd, yyyy"),
              serviceTime: job.requested_time,
              packageName: job.cleaning_packages.package_name,
              address: job.customer_addresses.country === "Portugal"
                ? `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}, ${job.customer_addresses.codigo_postal}`
                : `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}`,
              totalAmount: totalWithAddons.toFixed(2),
              currency: currency,
            },
          });
        }
      }

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
      // Call secure edge function for job status update
      const { error } = await supabase.functions.invoke('update-job-status', {
        body: {
          bookingId: id,
          newStatus: newStatus
        }
      });

      if (error) throw error;

      // Send status update email to customer
      if (job) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: providerProfile } = await supabase
            .from("provider_profiles")
            .select("full_name")
            .eq("user_id", user.id)
            .single();

          if (providerProfile) {
            const serviceDate = new Date(job.requested_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            const addressStr = job.customer_addresses.country === "Portugal"
              ? `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}, ${job.customer_addresses.codigo_postal}`
              : `${job.customer_addresses.rua}, ${job.customer_addresses.localidade}`;

            await supabase.functions.invoke('send-provider-status-update', {
              body: {
                customerEmail: job.profiles.email,
                customerName: `${job.profiles.first_name} ${job.profiles.last_name}`,
                bookingId: job.id,
                providerName: providerProfile.full_name,
                status: newStatus,
                serviceDate: serviceDate,
                serviceTime: job.requested_time,
                address: addressStr,
                estimatedArrival: newStatus === "on_the_way" ? "15-20 minutes" : undefined
              }
            });
          }
        }
      }

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
    // total_estimate already includes addons, so we use it directly
    return Number(job.total_estimate);
  };

  const getBaseAmount = () => {
    if (!job) return 0;
    // Base amount is just the package price (total_estimate - addons)
    const jobAddons = getJobAddons();
    const addonsTotal = jobAddons.reduce((sum, addon) => sum + Number(addon.price), 0);
    return Number(job.total_estimate) - addonsTotal;
  };

  const isJobConfirmed = job?.job_status !== "pending" && job?.job_status !== "declined";

  const serviceIcons: Record<string, React.ComponentType<any>> = {
    bathroom: Bath,
    kitchen: UtensilsCrossed,
    livingroom: Sofa,
    floors: Sparkles,
    dusting: Sparkles,
    surfaces: Waves,
    vacuuming: Sparkles
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
  const baseAmount = getBaseAmount();
  const jobAddons = getJobAddons();
  const addonsTotal = jobAddons.reduce((sum, addon) => sum + Number(addon.price), 0);
  const platformFee = (totalWithAddons * 0.15).toFixed(2);
  const earnings = (totalWithAddons - Number(platformFee)).toFixed(2);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <HeroButton
            isIconOnly
            variant="light"
            onPress={() => navigate("/provider/jobs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </HeroButton>
          <h1 className="text-lg sm:text-xl font-bold text-foreground">Job Details</h1>
        </div>
      </header>

      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Customer Card with Status */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            {/* Customer Info - Mobile Optimized */}
            <div className="flex items-start gap-3 mb-4">
              <AvatarDisplay 
                userId={job.customer_id}
                size={56}
                fallbackText={getInitials(job.profiles?.first_name, job.profiles?.last_name)}
                className="border-2 border-primary/20 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg font-bold truncate">
                  {job.profiles?.first_name || "Customer"} {job.profiles?.last_name || ""}
                </h2>
                <div className="badge badge-outline mt-1 text-xs">
                  #{job.id.slice(0, 8)}
                </div>
                
                {/* Contact Info - Mobile Friendly */}
                {isJobConfirmed && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.profiles?.phone && (
                      <a href={`tel:${job.profiles.phone}`} className="flex-1 min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full">
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Call</span>
                        </Button>
                      </a>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 min-w-[120px]"
                      onClick={() => setChatOpen(true)}
                    >
                      <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Message</span>
                    </Button>
                    {job.profiles?.email && (
                      <a href={`mailto:${job.profiles.email}`} className="flex-1 min-w-[120px]">
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-3.5 w-3.5 mr-1.5" />
                          <span className="text-xs">Email</span>
                        </Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Status Bar for Confirmed Jobs */}
            {isJobConfirmed && (
              <div className="mt-4">
                <JobStatusBar currentStatus={job.job_status} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabbed Interface */}
        <Tabs 
          defaultSelectedKey="when" 
          color="secondary"
          radius="lg"
          className="w-full"
          classNames={{
            tabList: "grid w-full grid-cols-2",
            tab: "text-xs sm:text-sm h-12"
          }}
        >
          <Tab 
            key="when" 
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>When</span>
              </div>
            }
          >
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Date</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {format(new Date(job.requested_date), "EEEE, MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Start Time</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{job.requested_time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Cleaning Duration</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Up to {job.cleaning_packages?.time_included || "N/A"}
                    </p>
                  </div>
                </div>

                {jobAddons.length > 0 && (
                  <div className="border-t pt-3 sm:pt-4">
                    <p className="font-medium mb-2 text-sm sm:text-base">Add-ons</p>
                    <div className="space-y-1.5">
                      {jobAddons.map(addon => (
                        <div key={addon.id} className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground truncate mr-2">{addon.name_en}</span>
                          <span className="font-medium flex-shrink-0">€{Number(addon.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Earnings Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Euro className="h-4 w-4 sm:h-5 sm:w-5" />
                  Estimated Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs sm:text-sm">Base Amount</span>
                  <span className="font-medium text-sm sm:text-base">€{baseAmount.toFixed(2)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-xs sm:text-sm">Add-ons</span>
                    <span className="font-medium text-sm sm:text-base">
                      €{addonsTotal.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs sm:text-sm">Platform Fee (15%)</span>
                  <span className="font-medium text-sm sm:text-base text-red-600">-€{platformFee}</span>
                </div>
                <div className="border-t pt-2.5 sm:pt-3 flex justify-between items-center">
                  <span className="font-semibold text-base sm:text-lg">Your Earnings</span>
                  <span className="font-bold text-base sm:text-lg text-green-600">€{earnings}</span>
                </div>
              </CardContent>
            </Card>

            {/* Overtime Rule Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
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
            <div className="space-y-2.5 sm:space-y-3">
              {job.job_status === "pending" && (
                <>
                  <Button
                    className="w-full h-11 sm:h-12 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-sm sm:text-base"
                    size="lg"
                    onClick={() => setShowAcceptDialog(true)}
                  >
                    Accept Job
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 sm:h-12 text-sm sm:text-base"
                    size="lg"
                    onClick={() => setShowDeclineDialog(true)}
                  >
                    Decline
                  </Button>
                </>
              )}

              {job.job_status === "confirmed" && (
                <Button
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                  onClick={() => updateJobStatus("on_the_way")}
                >
                  I'm On the Way
                </Button>
              )}

              {job.job_status === "on_the_way" && (
                <Button
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                  onClick={() => updateJobStatus("arrived")}
                >
                  I've Arrived
                </Button>
              )}

              {job.job_status === "arrived" && (
                <Button
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                  onClick={() => updateJobStatus("started")}
                >
                  Start Job
                </Button>
              )}

              {job.job_status === "started" && (
                <Button
                  className="w-full h-11 sm:h-12 text-sm sm:text-base"
                  size="lg"
                  onClick={() => updateJobStatus("completed")}
                >
                  Complete Job
                </Button>
              )}
            </div>
            </div>
          </Tab>

          <Tab 
            key="where" 
            title={
              <div className="flex items-center gap-1 sm:gap-2">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Where</span>
              </div>
            }
          >
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Customer Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-sm sm:text-base">
                    {job.profiles?.first_name || "Customer"} {job.profiles?.last_name || ""}
                  </p>
                </div>

                {isJobConfirmed ? (
                  <>
                    {job.profiles?.phone && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Phone Number</p>
                        <a href={`tel:${job.profiles.phone}`} className="font-medium text-sm sm:text-base text-primary hover:underline">
                          {job.profiles.phone}
                        </a>
                      </div>
                    )}
                    {job.profiles?.email && (
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Email</p>
                        <a href={`mailto:${job.profiles.email}`} className="font-medium text-sm sm:text-base text-primary hover:underline break-all">
                          {job.profiles.email}
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs sm:text-sm">
                      Contact details will be revealed after accepting the job
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Country</p>
                  <p className="font-medium text-sm sm:text-base">{job.customer_addresses?.country || "Portugal"} 🇵🇹</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium text-sm sm:text-base leading-relaxed">
                    {job.customer_addresses?.rua || "Address not available"}
                    {job.customer_addresses?.porta_andar && `, ${job.customer_addresses.porta_andar}`}
                    <br />
                    {job.customer_addresses?.codigo_postal}, {job.customer_addresses?.localidade}
                  </p>
                </div>

                {isJobConfirmed && (
                  <Button
                    variant="outline"
                    className="w-full text-xs sm:text-sm"
                    onClick={openInMaps}
                  >
                    <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Property Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Property Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Property Type</p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {job.customer_addresses?.property_type || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base">Layout</p>
                    <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                      {job.customer_addresses?.layout_type || `${job.cleaning_packages?.bedroom_count || 0} Bedrooms`}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-3 text-sm sm:text-base">Included Services</p>
                  <div className="grid grid-cols-2 gap-2">
                    {job.cleaning_packages?.areas_included?.map((area) => {
                      const IconComponent = serviceIcons[area] || Sparkles;
                      return (
                        <div key={area} className="flex items-center gap-2 text-xs sm:text-sm">
                          <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                          <span className="capitalize truncate">{area.replace("_", " ")}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </Tab>
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

      <ChatDrawer
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        bookingId={job.id}
        otherPartyName={`${job.profiles.first_name} ${job.profiles.last_name}`}
      />
    </div>
  );
};

export default JobDetail;
