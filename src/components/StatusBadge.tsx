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
  pending: "bg-black text-white",
  confirmed: "bg-black text-white",
  on_the_way: "bg-black text-white",
  arrived: "bg-black text-white",
  started: "bg-black text-white",
  completed: "bg-black text-white",
  cancelled: "bg-black text-white",
} as const;


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
