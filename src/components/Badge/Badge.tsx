import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const baseStyles =
  "inline-flex items-center rounded-full font-medium leading-none text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variantStyles = {
  subtle:
    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  solid: "bg-gray-900 text-white",
} as const;

const sizeStyles = {
  sm: "px-2 py-1",
  md: "px-2 py-1",
} as const;

export type BadgeVariant = keyof typeof variantStyles;
export type BadgeSize = keyof typeof sizeStyles;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className = "", variant = "subtle", size = "md", asChild, ...props },
    forwardedRef
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={forwardedRef}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
