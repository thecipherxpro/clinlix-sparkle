import { useI18n } from "@/contexts/I18nContext";

const STATUS_COLORS = {
  pending: "bg-black text-white",
  confirmed: "bg-black text-white",
  on_the_way: "bg-black text-white",
  arrived: "bg-black text-white",
  started: "bg-black text-white",
  completed: "bg-black text-white",
  cancelled: "bg-black text-white",
} as const;

const STATUS_MAP = {
  pending: 'pending',
  confirmed: 'confirmed',
  on_the_way: 'onTheWay',
  arrived: 'arrived',
  started: 'started',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

interface StatusBadgeProps {
  status: keyof typeof STATUS_COLORS;
  className?: string;
}

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const { t } = useI18n();
  const statusKey = STATUS_MAP[status] as keyof typeof t.status;
  const label = t.status[statusKey] || status;
  const bgColor = STATUS_COLORS[status] || "badge-ghost";

  return (
    <div className={`flex justify-start ${className}`}>
      <div className={`badge ${bgColor} border-0 shadow-md px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold animate-fade-in`}>
        {label}
      </div>
    </div>
  );
};
