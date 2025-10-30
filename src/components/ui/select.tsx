import * as React from "react";
import { Dropdown } from "flowbite-react";
import type { DropdownProps } from "flowbite-react";

import { cn } from "@/lib/utils";

interface SelectProps {
  value?: any;
  onValueChange?: (value: any) => void;
  children?: React.ReactNode;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("relative inline-block", className)}>
        {children}
      </div>
    );
  }
);
Select.displayName = "Select";

const SelectGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface SelectValueProps {
  children?: React.ReactNode;
  placeholder?: string;
}

const SelectValue = ({ children, placeholder }: SelectValueProps) => {
  return <>{children || placeholder}</>;
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = () => null;
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = () => null;
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute z-50 mt-1 max-h-96 min-w-[8rem] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md p-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-1.5 pl-2 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children?: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
