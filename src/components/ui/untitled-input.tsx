import * as React from "react";
import { cn } from "@/lib/utils";
import { InfoCircle } from "@untitledui/icons";

export interface UntitledInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: "sm" | "md";
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
}

const UntitledInput = React.forwardRef<
  HTMLInputElement,
  UntitledInputProps
>(({ className, size = "md", icon: Icon, error, disabled, ...props }, ref) => {
  const hasLeadingIcon = !!Icon;
  const hasTrailingIcon = error;

  const sizeClasses = {
    sm: cn(
      "h-10 px-3 py-2 text-sm",
      hasTrailingIcon && "pr-9",
      hasLeadingIcon && "pl-10"
    ),
    md: cn(
      "h-12 px-3.5 py-2.5 text-base",
      hasTrailingIcon && "pr-10",
      hasLeadingIcon && "pl-11"
    ),
  };

  const iconSizes = {
    sm: {
      leading: "left-3",
      trailing: "right-3",
    },
    md: {
      leading: "left-3.5",
      trailing: "right-3.5",
    },
  };

  return (
    <div className="relative flex w-full">
      <div
        className={cn(
          "relative flex w-full flex-row items-center rounded-lg bg-background shadow-sm ring-1 ring-border transition-all duration-100",
          "focus-within:ring-2 focus-within:ring-primary",
          error && "ring-destructive focus-within:ring-destructive",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "pointer-events-none absolute size-5 text-muted-foreground",
              disabled && "opacity-50",
              iconSizes[size].leading
            )}
          />
        )}

        <input
          {...props}
          ref={ref}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent text-foreground ring-0 outline-none placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses[size],
            className
          )}
        />

        {error && (
          <InfoCircle
            className={cn(
              "pointer-events-none absolute size-4 text-destructive",
              iconSizes[size].trailing
            )}
          />
        )}
      </div>
    </div>
  );
});

UntitledInput.displayName = "UntitledInput";

export { UntitledInput };
