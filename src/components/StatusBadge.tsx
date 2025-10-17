const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  on_the_way: "On the Way",
  arrived: "Arrived",
  started: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled"
};

const STATUS_COLORS = {
  pending: "badge-warning text-white",
  confirmed: "badge-info text-white",
  on_the_way: "bg-gradient-to-r from-purple-500 to-purple-700 text-white",
  arrived: "badge-primary text-white",
  started: "badge-success text-white",
  completed: "badge-accent text-white",
  cancelled: "badge-error text-white"
};

interface StatusBadgeProps {
  status: keyof typeof STATUS_LABELS;
  className?: string;
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const label = STATUS_LABELS[status] || "Unknown";
  const bgColor = STATUS_COLORS[status] || "badge-ghost";

  return (
    <div className={`flex justify-start ${className}`}>
      <div className={`badge ${bgColor} border-0 shadow-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold animate-fade-in`}>
        {label}
      </div>
    </div>
  );
};
