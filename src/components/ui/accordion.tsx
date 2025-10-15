import * as React from "react";
import { Disclosure } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = ({ children, type, ...props }: { children: React.ReactNode; type?: 'single' | 'multiple'; [key: string]: any }) => (
  <div {...props}>{children}</div>
);

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Disclosure as="div" ref={ref} className={cn("border-b", className)} {...props}>
    {children}
  </Disclosure>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <h3 className="flex">
    <Disclosure.Button
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ui-open:rotate-180" />
    </Disclosure.Button>
  </h3>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Disclosure.Panel
    ref={ref}
    className="overflow-hidden text-sm"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </Disclosure.Panel>
));

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
