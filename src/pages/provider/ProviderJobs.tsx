import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
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
      <Tabs 
        selectedKey={activeTab} 
        onSelectionChange={(key) => setActiveTab(key as string)} 
        color="secondary"
        radius="lg"
        className="w-full"
        classNames={{
          tabList: "w-full grid grid-cols-3 bg-muted/30 sticky top-[73px] z-10",
          tab: "h-auto py-3"
        }}
      >
        <Tab 
          key="requests"
          title={
            <div className="flex flex-col items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Job Requests</span>
            </div>
          }
        >
          <div className="mt-0">
          <JobRequestsList />
          </div>
        </Tab>

        <Tab 
          key="confirmed"
          title={
            <div className="flex flex-col items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Confirmed</span>
            </div>
          }
        >
          <div className="mt-0">
          <ConfirmedJobsList />
          </div>
        </Tab>

        <Tab 
          key="completed"
          title={
            <div className="flex flex-col items-center gap-1">
              <Flag className="h-4 w-4" />
              <span className="text-xs font-medium">Completed</span>
            </div>
          }
        >
          <div className="mt-0">
          <CompletedJobsList />
          </div>
        </Tab>
      </Tabs>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderJobs;
