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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/50 backdrop-blur-sm border-b safe-top">
        <div className="mobile-container py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Jobs
          </h1>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-card/30 backdrop-blur-sm border-b sticky top-[69px] sm:top-[73px] z-10">
        <div className="mobile-container">
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)} 
            color="secondary"
            radius="lg"
            className="w-full"
            classNames={{
              tabList: "w-full grid grid-cols-3 gap-1 bg-transparent py-2",
              tab: "h-auto py-3 min-h-[60px] data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-primary/10 data-[selected=true]:to-accent/10 data-[selected=true]:shadow-sm rounded-lg"
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
          <div className="mobile-container py-4">
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
          <div className="mobile-container py-4">
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
          <div className="mobile-container py-4">
            <CompletedJobsList />
          </div>
        </Tab>
          </Tabs>
        </div>
      </div>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderJobs;
