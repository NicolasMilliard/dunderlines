import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';

function Sheet({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-black/20 will-change-opacity data-[state=closed]:animate-[sheet-overlay-out_160ms_ease-in] data-[state=open]:animate-[sheet-overlay-in_200ms_ease-out]',
        className,
      )}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-full max-w-105 transform-gpu overflow-y-auto border-l border-black/10 bg-white p-6 shadow-[-16px_0_40px_rgb(0_0_0/0.14)] outline-none will-change-transform data-[state=closed]:animate-[sheet-out-right_160ms_ease-in] data-[state=open]:animate-[sheet-in-right_200ms_ease-out] max-sm:top-auto max-sm:bottom-0 max-sm:h-auto max-sm:max-h-[88vh] max-sm:min-h-80 max-sm:max-w-none max-sm:border-l-0 max-sm:border-t max-sm:shadow-[0_-16px_40px_rgb(0_0_0/0.14)] max-sm:data-[state=closed]:animate-[sheet-out-bottom_160ms_ease-in] max-sm:data-[state=open]:animate-[sheet-in-bottom_200ms_ease-out]',
          className,
        )}
        {...props}
      >
        {children}
        <SheetClose className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-[0_1px_1px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.06)] outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black/15">
          <XIcon size={18} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('grid gap-1.5 text-left', className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sheet-title"
      className={cn('text-lg font-semibold text-black', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sheet-description"
      className={cn('text-sm text-black/60', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
