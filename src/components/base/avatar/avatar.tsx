import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "@/utils/cx";
import { VerifiedTick } from "./VerifiedTick";

const avatarVariants = cva(
  "relative inline-block flex-shrink-0 overflow-hidden bg-muted",
  {
    variants: {
      size: {
        xs: "size-6",
        sm: "size-8",
        md: "size-10",
        lg: "size-12",
        xl: "size-14",
        "2xl": "size-16",
        "3xl": "size-20",
        "4xl": "size-24",
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
  "h-full w-full object-cover",
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

const verifiedBadgeVariants = cva(
  "absolute",
  {
    variants: {
      size: {
        xs: "bottom-0 right-0",
        sm: "bottom-0 right-0",
        md: "bottom-0 right-0",
        lg: "bottom-0 right-0",
        xl: "bottom-0 right-0",
        "2xl": "bottom-0 right-0",
        "3xl": "bottom-0 right-0",
        "4xl": "bottom-0 right-0",
      },
    },
    defaultVariants: {
      size: "md",
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
  size = "md",
  shape = "circle",
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
        return "bg-muted-foreground";
      default:
        return "";
    }
  };

  return (
    <div className={cx(avatarVariants({ size, shape }), className)} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={cx(avatarImageVariants({ shape }))}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium text-sm">
          {getFallbackText()}
        </div>
      )}

      {/* Verified Badge */}
      {verified && (
        <div
          className={cx(verifiedBadgeVariants({ size }))}
          aria-label="Verified"
        >
          <VerifiedTick size={size || "md"} />
        </div>
      )}

      {/* Online Status Indicator */}
      {onlineStatus && !verified && (
        <div
          className={cx(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-background",
            size === "xs" || size === "sm" ? "size-2" : "size-3",
            getStatusColor()
          )}
          aria-label={`Status: ${onlineStatus}`}
        />
      )}
    </div>
  );
}
