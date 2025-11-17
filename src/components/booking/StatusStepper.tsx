import { CheckCircle, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "upcoming";
}

interface StatusStepperProps {
  currentStatus: string;
}

export const StatusStepper = ({ currentStatus }: StatusStepperProps) => {
  const getSteps = (): Step[] => {
    const statusOrder = ["pending", "confirmed", "started", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return [
      { label: "Requested", status: currentIndex >= 0 ? "completed" : "upcoming" },
      { label: "Confirmed", status: currentIndex >= 1 ? "completed" : currentIndex === 0 ? "current" : "upcoming" },
      { label: "In Progress", status: currentIndex >= 2 ? "completed" : currentIndex === 1 ? "current" : "upcoming" },
      { label: "Completed", status: currentIndex >= 3 ? "completed" : currentIndex === 2 ? "current" : "upcoming" },
    ];
  };

  const steps = getSteps();

  const getStepIcon = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary/10" />;
      case "current":
        return <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin" />;
      case "upcoming":
        return <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-2.5 sm:top-3 left-0 right-0 h-0.5 bg-border">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${(steps.filter(s => s.status === "completed").length / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 z-10 relative"
          >
            <div className="bg-background px-1">
              {getStepIcon(step.status)}
            </div>
            <span
              className={cn(
                "text-xs sm:text-sm font-medium text-center max-w-[70px] sm:max-w-[80px]",
                step.status === "completed" && "text-primary",
                step.status === "current" && "text-primary font-semibold",
                step.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
