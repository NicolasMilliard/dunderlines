import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectDropdownProps = {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
};

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onToggle,
  onSelectAll,
  onClear,
}: MultiSelectDropdownProps) {
  const selectedValueSet = new Set(selectedValues);
  const selectedCount = selectedValues.length;
  const allSelected = selectedCount === options.length;
  const summary = allSelected
    ? 'All'
    : selectedCount === 0
      ? 'None'
      : `${selectedCount} selected`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group flex h-9 min-w-34 cursor-pointer items-center justify-between gap-2 rounded-xl border border-black/10 bg-white/85 px-2.5 text-left text-xs shadow-[0_1px_1px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.06)] outline-none backdrop-blur transition-all duration-150 hover:-translate-y-px hover:border-black/15 hover:bg-white focus-visible:ring-2 focus-visible:ring-black/15 data-[state=open]:-translate-y-px data-[state=open]:border-black/15 data-[state=open]:bg-white data-[state=open]:shadow-[0_1px_1px_rgb(0_0_0/0.04),0_12px_28px_rgb(0_0_0/0.1)]"
          type="button"
          aria-label={`${label}: ${summary}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate font-medium text-black/85">{label}</span>
            <span className="h-3.5 w-px bg-black/10" aria-hidden="true" />
            <span className="truncate font-medium text-black/45">
              {summary}
            </span>
          </span>
          <ChevronDown
            className="size-3.5 shrink-0 text-black/45 transition-transform duration-150 group-hover:text-black/70 group-data-[state=open]:rotate-180 group-data-[state=open]:text-black/70"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <span>{label}</span>
          <span>{summary}</span>
        </DropdownMenuLabel>
        <div className="grid grid-cols-2 gap-1 p-1">
          <DropdownMenuItem
            className="justify-center text-xs font-medium"
            onSelect={(event) => {
              event.preventDefault();
              onSelectAll();
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            className="justify-center text-xs font-medium"
            onSelect={(event) => {
              event.preventDefault();
              onClear();
            }}
          >
            None
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />

        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValueSet.has(option.value)}
            onCheckedChange={() => onToggle(option.value)}
            onSelect={(event) => event.preventDefault()}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
