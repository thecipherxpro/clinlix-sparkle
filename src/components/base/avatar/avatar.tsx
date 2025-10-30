import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const avatarVariants = cva(
  "relative inline-block flex-shrink-0",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-14 w-14",
        "2xl": "h-16 w-16",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
);

const avatarImageVariants = cva(
  "object-cover",
  {
    variants: {
      shape: {
        circle: "rounded-full",
        rounded: "rounded-lg",
      },
    },
    defaultVariants: {
      shape: "circle",
    },
  }
);

const badgeVariants = cva(
  "absolute flex items-center justify-center ring-2 ring-background",
  {
    variants: {
      size: {
        xs: "h-2 w-2 -bottom-0 -right-0",
        sm: "h-2.5 w-2.5 -bottom-0 -right-0",
        md: "h-3 w-3 -bottom-0.5 -right-0.5",
        lg: "h-3.5 w-3.5 -bottom-0.5 -right-0.5",
        xl: "h-4 w-4 -bottom-1 -right-1",
        "2xl": "h-5 w-5 -bottom-1 -right-1",
      },
      shape: {
        circle: "rounded-full",
        rounded: "rounded-md",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
    },
  }
);

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  verified?: boolean;
  fallback?: string;
  onlineStatus?: "online" | "offline" | "away";
}

export function Avatar({
  className,
  size,
  shape,
  src,
  alt = "Avatar",
  verified = false,
  fallback,
  onlineStatus,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  
  const getFallbackText = () => {
    if (fallback) return fallback;
    if (alt) {
      return alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "?";
  };

  const getStatusColor = () => {
    switch (onlineStatus) {
      case "online":
        return "bg-success";
      case "away":
        return "bg-warning";
      case "offline":
        return "bg-muted";
      default:
        return "";
    }
  };

  return (
    <div className={cn(avatarVariants({ size, shape }), className)} {...props}>
      <div className={cn("h-full w-full overflow-hidden", shape === "circle" ? "rounded-full" : "rounded-lg")}>
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className={cn(avatarImageVariants({ shape }), "h-full w-full")}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium text-sm">
            {getFallbackText()}
          </div>
        )}
      </div>

      {/* Verified Badge */}
      {verified && (
        <div
          className={cn(
            badgeVariants({ size, shape }),
            "bg-primary text-primary-foreground"
          )}
          aria-label="Verified"
        >
          {size !== "xs" && size !== "sm" && (
            <Check className="h-full w-full p-0.5" strokeWidth={3} />
          )}
        </div>
      )}

      {/* Online Status Indicator */}
      {onlineStatus && !verified && (
        <div
          className={cn(
            badgeVariants({ size, shape }),
            getStatusColor()
          )}
          aria-label={`Status: ${onlineStatus}`}
        />
      )}
    </div>
  );
}
