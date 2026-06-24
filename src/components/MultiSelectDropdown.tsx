import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedValueSet = new Set(selectedValues);
  const selectedCount = selectedValues.length;
  const allSelected = selectedCount === options.length;
  const summary = allSelected
    ? 'All'
    : selectedCount === 0
      ? 'None'
      : `${selectedCount} selected`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex min-w-36 cursor-pointer items-center justify-between gap-2 rounded-md border border-black/10 bg-white px-2.5 py-1.5 text-left text-xs shadow-sm outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-2 focus-visible:ring-black/20"
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
      >
        <span className="grid gap-0.5">
          <span className="font-medium text-black">{label}</span>
          <span className="text-[11px] text-black/50">{summary}</span>
        </span>
        <ChevronDown
          className={`size-3.5 text-black/55 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-md border border-black/10 bg-white p-2 shadow-[0_16px_40px_rgb(0_0_0/0.14)]">
          <div className="mb-2 flex gap-2 border-b border-black/10 pb-2">
            <button
              className="rounded px-2 py-1 text-xs font-semibold text-black hover:bg-black/[0.06]"
              type="button"
              onClick={onSelectAll}
            >
              All
            </button>
            <button
              className="rounded px-2 py-1 text-xs font-semibold text-black hover:bg-black/[0.06]"
              type="button"
              onClick={onClear}
            >
              None
            </button>
          </div>

          <div className="grid gap-1">
            {options.map((option) => (
              <label
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-black hover:bg-black/[0.04]"
                key={option.value}
              >
                <input
                  className="size-3.5 accent-black"
                  type="checkbox"
                  checked={selectedValueSet.has(option.value)}
                  onChange={() => onToggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
