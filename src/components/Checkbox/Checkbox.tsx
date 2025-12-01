import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, label, description, containerClassName, ...props }, ref) => (
  <label className={cn("flex items-start gap-3", containerClassName)}>
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-white text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {(label || description) && (
      <span className="flex flex-col">
        {label && (
          <span className="text-sm font-medium text-gray-900">{label}</span>
        )}
        {description && (
          <span className="text-sm text-gray-500">{description}</span>
        )}
      </span>
    )}
  </label>
));
Checkbox.displayName = "Checkbox";
