import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cx } from "@/utils/cx";
import { VerifiedTick } from "./VerifiedTick";

const avatarContainerVariants = cva(
  "relative inline-block flex-shrink-0",
  {
    variants: {
      size: {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-14 h-14",
        "2xl": "w-16 h-16",
        "3xl": "w-20 h-20",
        "4xl": "w-24 h-24",
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

const avatarImageContainerVariants = cva(
  "overflow-hidden bg-muted w-full h-full",
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
  "absolute -bottom-0.5 -right-0.5",
  {
    variants: {
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        "2xl": "",
        "3xl": "",
        "4xl": "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof avatarContainerVariants>,
    VariantProps<typeof avatarImageContainerVariants> {
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
    <div className={cx(avatarContainerVariants({ size, shape }), className)} {...props}>
      <div className={cx(avatarImageContainerVariants({ shape }))}>
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
      </div>

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
            "absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-background",
            size === "xs" || size === "sm" ? "w-2 h-2" : "w-3 h-3",
            getStatusColor()
          )}
          aria-label={`Status: ${onlineStatus}`}
        />
      )}
    </div>
  );
}
