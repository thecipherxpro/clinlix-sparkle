import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      type: {
        "pill-color": "rounded-full",
      },
      color: {
        brand: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
      },
      size: {
        sm: "px-2.5 py-1 text-xs gap-1",
        md: "px-3 py-1.5 text-sm gap-1.5",
        lg: "px-4 py-2 text-base gap-2",
      },
    },
    defaultVariants: {
      type: "pill-color",
      color: "brand",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, type, color, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ type, color, size }), className)}
      {...props}
    />
  );
}
