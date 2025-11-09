import { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Clock, CheckCircle, Flag } from "lucide-react";
import JobRequestsList from "@/components/provider/jobs/JobRequestsList";
import ConfirmedJobsList from "@/components/provider/jobs/ConfirmedJobsList";
import CompletedJobsList from "@/components/provider/jobs/CompletedJobsList";
import { useI18n } from "@/contexts/I18nContext";

const ProviderJobs = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background pb-mobile-nav">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/50 backdrop-blur-sm border-b safe-top">
        <div className="mobile-container py-3 sm:py-4">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t.provider.myJobs}
          </h1>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-card/30 backdrop-blur-sm border-b">
        <div className="mobile-container py-3 sm:py-4">
          <Tabs 
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            size="md"
            fullWidth
            classNames={{
              tabList: "w-full bg-muted/50 p-1 rounded-lg gap-1",
              cursor: "bg-background shadow-sm rounded-md",
              tab: "h-10 sm:h-11 px-2 sm:px-4 text-xs sm:text-sm",
              tabContent: "group-data-[selected=true]:text-foreground"
            }}
          >
            <Tab 
              key="requests" 
              title={
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{t.provider.jobRequests}</span>
                  <span className="sm:hidden">{t.provider.requests}</span>
                </div>
              } 
            />
            <Tab 
              key="confirmed" 
              title={
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{t.provider.confirmed}</span>
                </div>
              } 
            />
            <Tab 
              key="completed" 
              title={
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Flag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{t.provider.completed}</span>
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
    </div>
  );
};

export default ProviderJobs;
