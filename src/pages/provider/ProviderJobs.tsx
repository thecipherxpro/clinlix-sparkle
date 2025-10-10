import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, Flag } from "lucide-react";
import JobRequestsList from "@/components/provider/jobs/JobRequestsList";
import ConfirmedJobsList from "@/components/provider/jobs/ConfirmedJobsList";
import CompletedJobsList from "@/components/provider/jobs/CompletedJobsList";
import ProviderMobileNav from "@/components/ProviderMobileNav";

const ProviderJobs = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-foreground">My Jobs</h1>
      </header>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted/30 sticky top-[73px] z-10">
          <TabsTrigger 
            value="requests" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">Job Requests</span>
          </TabsTrigger>
          <TabsTrigger 
            value="confirmed"
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Confirmed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Flag className="h-4 w-4" />
            <span className="text-xs font-medium">Completed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-0">
          <JobRequestsList />
        </TabsContent>

        <TabsContent value="confirmed" className="mt-0">
          <ConfirmedJobsList />
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          <CompletedJobsList />
        </TabsContent>
      </Tabs>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderJobs;
