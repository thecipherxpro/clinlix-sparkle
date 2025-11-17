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
        return <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary fill-primary/10" />;
      case "current":
        return <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary animate-spin" />;
      case "upcoming":
        return <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground/50" />;
    }
  };

  return (
    <div className="w-full py-4 sm:py-6 animate-fade-in">
      <div className="flex items-center justify-between relative px-2 sm:px-0">
        {/* Progress Line */}
        <div className="absolute top-3 sm:top-3.5 left-0 right-0 h-1 bg-border rounded-full mx-6 sm:mx-8">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{
              width: `${(steps.filter(s => s.status === "completed").length / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 sm:gap-2.5 z-10 relative animate-scale-in"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="bg-background p-0.5 rounded-full transition-transform duration-200 active:scale-95">
              {getStepIcon(step.status)}
            </div>
            <span
              className={cn(
                "text-[11px] sm:text-sm font-medium text-center max-w-[65px] sm:max-w-[85px] leading-tight transition-colors duration-300",
                step.status === "completed" && "text-primary font-semibold",
                step.status === "current" && "text-primary font-bold",
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
