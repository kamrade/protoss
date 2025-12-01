import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const baseStyles =
  "inline-flex items-center justify-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  solid: "bg-gray-900 text-white hover:bg-black focus-visible:outline-gray-900",
  outline:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-900",
  ghost: "text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-900",
} as const;

const sizeStyles = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-lg",
  lg: "h-12 w-12 text-xl",
} as const;

export type IconButtonVariant = keyof typeof variantStyles;
export type IconButtonSize = keyof typeof sizeStyles;

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  asChild?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className = "",
      variant = "solid",
      size = "md",
      asChild,
      ...props
    },
    forwardedRef
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={forwardedRef}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

IconButton.displayName = "IconButton";
