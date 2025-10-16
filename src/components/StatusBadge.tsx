import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pending: { variant: "secondary" as const, className: "" },
  confirmed: { variant: "default" as const, className: "" },
  on_the_way: { variant: "outline" as const, className: "border-primary/50 text-primary bg-primary/5" },
  arrived: { variant: "outline" as const, className: "border-accent/50 text-accent-foreground bg-accent/10" },
  started: { variant: "default" as const, className: "bg-accent text-accent-foreground" },
  completed: { variant: "default" as const, className: "bg-primary/80 text-primary-foreground" },
  cancelled: { variant: "destructive" as const, className: "" }
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  on_the_way: "On the Way",
  arrived: "Arrived",
  started: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled"
};

interface StatusBadgeProps {
  status: keyof typeof STATUS_CONFIG;
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const StatusBadge = ({ status, size = "default", className = "" }: StatusBadgeProps) => {
  const config = STATUS_CONFIG[status];
  const label = STATUS_LABELS[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      className={`w-fit ${config.className} ${className}`}
    >
      {label}
    </Badge>
  );
};
