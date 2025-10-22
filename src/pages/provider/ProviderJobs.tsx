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
        <div className="mobile-container py-3">
          <Tabs 
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            classNames={{
              tabList: "w-full bg-muted p-1 rounded-lg",
              cursor: "bg-background shadow-sm",
            }}
          >
            <Tab 
              key="requests" 
              title={
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Job Requests
                </div>
              } 
            />
            <Tab 
              key="confirmed" 
              title={
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Confirmed
                </div>
              } 
            />
            <Tab 
              key="completed" 
              title={
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Completed
                </div>
              } 
            />
          </Tabs>
        </div>
      </div>

      <div className="mobile-container py-4">
        {activeTab === 'requests' && <JobRequestsList />}
        {activeTab === 'confirmed' && <ConfirmedJobsList />}
        {activeTab === 'completed' && <CompletedJobsList />}
      </div>

      <ProviderMobileNav />
    </div>
  );
};

export default ProviderJobs;
