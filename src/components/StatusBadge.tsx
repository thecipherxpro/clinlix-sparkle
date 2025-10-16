import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  pending: { variant: "secondary" as const, className: "hover:bg-secondary" },
  confirmed: { variant: "default" as const, className: "hover:bg-primary" },
  on_the_way: { variant: "outline" as const, className: "border-primary/50 text-primary hover:bg-transparent" },
  arrived: { variant: "outline" as const, className: "border-accent text-accent-foreground bg-accent/10 hover:bg-accent/10" },
  started: { variant: "default" as const, className: "bg-accent hover:bg-accent text-accent-foreground" },
  completed: { variant: "default" as const, className: "bg-primary/80 hover:bg-primary/80" },
  cancelled: { variant: "destructive" as const, className: "hover:bg-destructive" }
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
