import * as React from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface SelectProps extends Omit<React.ComponentProps<typeof Listbox>, 'value' | 'onChange'> {
  value?: any;
  onValueChange?: (value: any) => void;
  onChange?: (value: any) => void;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (val: any) => {
      onChange?.(val);
      onValueChange?.(val);
    };

    return <Listbox value={value} onChange={handleChange} {...props} />;
  }
);
Select.displayName = "Select";

const SelectGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

interface SelectValueProps {
  children?: React.ReactNode;
  placeholder?: string;
}

const SelectValue = ({ children, placeholder }: SelectValueProps) => <>{children || placeholder}</>;

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <Listbox.Button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </Listbox.Button>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = () => null;
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = () => null;
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Transition
    as={React.Fragment}
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Listbox.Options
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-96 min-w-[8rem] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md focus:outline-none p-1",
        className,
      )}
      {...props}
    >
      {children}
    </Listbox.Options>
  </Transition>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<typeof Listbox.Option> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <Listbox.Option
    ref={ref}
    className={({ active }: { active: boolean }) => cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none disabled:pointer-events-none disabled:opacity-50",
      active && "bg-accent text-accent-foreground",
      className,
    )}
    {...props}
  >
    {(renderProps) => {
      const content = typeof children === 'function' ? (children as any)(renderProps) : children;
      return (
        <>
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            {renderProps.selected && <Check className="h-4 w-4" />}
          </span>
          <span>{content}</span>
        </>
      );
    }}
  </Listbox.Option>
));
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
