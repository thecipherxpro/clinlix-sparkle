import * as React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

import { cn } from "@/lib/utils";

const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  width: "1rem",
  height: "1rem",
  "@media (min-width: 640px)": {
    width: "1rem",
    height: "1rem",
  },
  "@media (min-width: 768px)": {
    width: "1rem",
    height: "1rem",
  },
  "&.Mui-checked": {
    color: "hsl(var(--primary))",
  },
  "&:hover": {
    backgroundColor: "hsl(var(--primary) / 0.1)",
  },
  "&.Mui-focusVisible": {
    outline: "2px solid hsl(var(--ring))",
    outlineOffset: "2px",
  },
}));

interface CheckboxProps extends Omit<React.ComponentProps<typeof MuiCheckbox>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => (
    <StyledCheckbox
      ref={ref}
      className={cn(className)}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
