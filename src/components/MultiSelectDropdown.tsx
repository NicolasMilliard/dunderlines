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
          className="group flex min-w-36 cursor-pointer items-center justify-between gap-2 rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-left text-xs shadow-sm outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black/20 data-[state=open]:bg-black/[0.03]"
          type="button"
        >
          <span className="grid gap-0.5">
            <span className="font-medium text-black">{label}</span>
            <span className="text-[11px] text-black/50">{summary}</span>
          </span>
          <ChevronDown
            className="size-3.5 text-black/55 transition-transform group-data-[state=open]:rotate-180"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <div className="flex gap-1 px-1">
          <DropdownMenuItem
            className="flex-1 justify-center text-xs font-semibold"
            onSelect={(event) => {
              event.preventDefault();
              onSelectAll();
            }}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex-1 justify-center text-xs font-semibold"
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
