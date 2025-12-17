import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetPortal = DialogPrimitive.Portal;
export const SheetClose = DialogPrimitive.Close;



export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-gray-950/60 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out data-[state=closed]:opacity-0 data-[state=open]:opacity-100",
      "data-[state=open]:[animation:fade-in_220ms_ease-out_both] data-[state=closed]:[animation:fade-out_200ms_ease-out_both]",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;



export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "SheetContent fixed right-0 top-0 z-50 h-full w-full max-w-md gap-6 rounded-tl-3xl rounded-bl-3xl border border-gray-200 bg-white p-6 shadow-2xl focus-visible:outline-none motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out data-[state=closed]:translate-x-full data-[state=open]:translate-x-0",
        "data-[state=open]:[animation:slide-in-right_300ms_cubic-bezier(.2,.8,.2,1)_both] data-[state=closed]:[animation:slide-out-right_260ms_cubic-bezier(.2,.8,.2,1)_both]",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;



export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";



export const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";



export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;



export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));



SheetDescription.displayName = DialogPrimitive.Description.displayName;
