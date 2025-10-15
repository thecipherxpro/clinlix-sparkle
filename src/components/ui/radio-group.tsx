import * as React from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { Circle } from "lucide-react";

import { cn } from "@/lib/utils";

interface RadioGroupProps extends Omit<React.ComponentProps<typeof HeadlessRadioGroup>, 'value' | 'onChange'> {
  value?: any;
  onValueChange?: (value: any) => void;
  onChange?: (value: any) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (val: any) => {
      onChange?.(val);
      onValueChange?.(val);
    };

    return (
      <HeadlessRadioGroup 
        className={cn("grid gap-2", className)} 
        value={value}
        onChange={handleChange}
        {...props} 
      />
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof HeadlessRadioGroup.Option>
>(({ className, children, ...props }, ref) => {
  return (
    <HeadlessRadioGroup.Option
      ref={ref}
      className={({ checked }) => cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        className,
      )}
      {...props}
    >
      {({ checked }) => (
        <>
          {checked && <Circle className="h-2.5 w-2.5 fill-current text-current" />}
          {children}
        </>
      )}
    </HeadlessRadioGroup.Option>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
