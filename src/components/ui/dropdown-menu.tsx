import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../lib/utils';

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-h-72 min-w-58 origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto rounded-2xl border border-black/10 bg-white/92 p-1.5 text-black shadow-[0_1px_1px_rgb(0_0_0/0.04),0_18px_50px_rgb(0_0_0/0.14)] outline-none backdrop-blur-xl data-[state=open]:animate-[dropdown-menu-in_140ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[dropdown-menu-out_100ms_ease-in]',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  );
}

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: 'default' | 'destructive';
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm text-black/75 outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset=true]:pl-8 data-highlighted:bg-black/4.5 data-highlighted:text-black',
        variant === 'destructive' &&
          'text-red-600 data-highlighted:bg-red-50 data-highlighted:text-red-700',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      checked={checked}
      className={cn(
        'group relative flex cursor-default select-none items-center rounded-xl px-2.5 py-1.5 pl-8 text-sm text-black/75 outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-black/4.5 data-highlighted:text-black',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center rounded-md  bg-white text-white transition-colors group-data-[state=checked]:bg-black">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-3" strokeWidth={2.4} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        'relative flex cursor-default select-none items-center rounded-xl px-2.5 py-1.5 pl-8 text-sm text-black/75 outline-none transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-black/4.5 data-highlighted:text-black',
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" strokeWidth={2} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-inset={inset}
      data-slot="dropdown-menu-label"
      className={cn(
        'flex items-center justify-between gap-4 px-2.5 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-black/45 data-[inset=true]:pl-8',
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1.5 my-1.5 h-px bg-black/8', className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-black/50', className)}
      {...props}
    />
  );
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        'flex cursor-default select-none items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm text-black/75 outline-none transition-colors data-[inset=true]:pl-8 data-highlighted:bg-black/4.5 data-highlighted:text-black',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3.5" strokeWidth={2} />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        'z-50 min-w-56 rounded-2xl border border-black/10 bg-white/92 p-1.5 text-black shadow-[0_1px_1px_rgb(0_0_0/0.04),0_18px_50px_rgb(0_0_0/0.14)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
