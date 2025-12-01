import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const intentStyles = {
  default:
    "border-gray-200 focus-within:border-gray-900 focus-within:ring-gray-100",
  success:
    "border-emerald-400 focus-within:border-emerald-600 focus-within:ring-emerald-50",
  warning:
    "border-amber-400 focus-within:border-amber-500 focus-within:ring-amber-50",
} as const;

export type TextFieldIntent = keyof typeof intentStyles;

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  leadingVisual?: React.ReactNode;
  trailingVisual?: React.ReactNode;
  wrapperClassName?: string;
  fieldClassName?: string;
  intent?: TextFieldIntent;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      description,
      errorMessage,
      leadingVisual,
      trailingVisual,
      wrapperClassName,
      fieldClassName,
      className,
      intent = "default",
      id,
      disabled,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;
    const describedBy = [errorId, descriptionId].filter(Boolean).join(" ") || undefined;
    const toneClass = errorMessage
      ? "border-red-400 focus-within:border-red-600 focus-within:ring-red-50"
      : intentStyles[intent];

    const renderVisual = (visual?: React.ReactNode) => {
      if (!visual) {
        return null;
      }

      const iconClass = cn(
        "flex items-center text-gray-400",
        disabled && "text-gray-300",
        errorMessage && "text-red-500"
      );

      return React.isValidElement(visual) ? (
        <Slot className={iconClass}>{visual}</Slot>
      ) : (
        <span className={iconClass}>{visual}</span>
      );
    };

    return (
      <div className={cn("flex w-full flex-col gap-2", wrapperClassName)}>
        {label && (
          <LabelPrimitive.Root
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500"
          >
            {label}
          </LabelPrimitive.Root>
        )}
        <div
          data-disabled={disabled ? "true" : undefined}
          className={cn(
            "inline-flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition focus-within:ring-4 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-gray-50 data-[disabled=true]:opacity-70",
            toneClass,
            fieldClassName
          )}
        >
          {renderVisual(leadingVisual)}
          <input
            id={inputId}
            ref={forwardedRef}
            disabled={disabled}
            aria-describedby={describedBy}
            className={cn(
              "flex-1 border-none bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed",
              className
            )}
            {...props}
          />
          {renderVisual(trailingVisual)}
        </div>
        {errorMessage ? (
          <p id={errorId} className="text-sm text-red-600">
            {errorMessage}
          </p>
        ) : description ? (
          <p id={descriptionId} className="text-sm text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
