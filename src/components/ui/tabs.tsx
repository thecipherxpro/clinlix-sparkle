import * as React from "react";
import { Tab } from "@headlessui/react";

import { cn } from "@/lib/utils";

interface TabsProps extends Omit<React.ComponentProps<typeof Tab.Group>, 'selectedIndex' | 'onChange'> {
  value?: string | number;
  onValueChange?: (value: any) => void;
  selectedIndex?: number;
  defaultIndex?: number;
  defaultValue?: string | number;
  onChange?: (index: number) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, selectedIndex, defaultIndex, defaultValue, onChange, ...props }, ref) => {
    const handleChange = (index: number) => {
      onChange?.(index);
      onValueChange?.(index);
    };

    return (
      <Tab.Group 
        selectedIndex={typeof value === 'number' ? value : selectedIndex} 
        defaultIndex={typeof defaultValue === 'number' ? defaultValue : defaultIndex}
        onChange={handleChange} 
        {...props} 
      />
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Tab.List
    ref={ref}
    className={cn("inline-flex min-h-[44px] items-center justify-center rounded-md bg-muted p-1 text-muted-foreground gap-1", className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Tab
    ref={ref}
    className={({ selected }) => cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium min-h-[44px] ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      selected && "bg-background text-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string | number;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => (
    <Tab.Panel
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  )
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
