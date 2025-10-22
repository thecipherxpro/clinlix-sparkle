import { useState } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
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
          <AnimatedTabs 
            tabs={[
              { key: 'requests', label: 'Job Requests', icon: <Clock className="h-4 w-4" /> },
              { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="h-4 w-4" /> },
              { key: 'completed', label: 'Completed', icon: <Flag className="h-4 w-4" /> }
            ]}
            selected={activeTab}
            onTabChange={(key) => setActiveTab(key as string)}
          />
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
