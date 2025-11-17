import * as React from "react";
import { Popover as HeadlessPopover, Transition } from "@headlessui/react";

import { cn } from "@/lib/utils";

const Popover = HeadlessPopover;

const PopoverTrigger = HeadlessPopover.Button;

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Transition
    as={React.Fragment}
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-1"
  >
    <HeadlessPopover.Panel
      ref={ref}
      className={cn(
        "absolute right-0 top-full mt-2 z-[100] w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
        className,
      )}
      {...props}
    />
  </Transition>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
