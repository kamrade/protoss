"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@radix-ui/react-icons";
import { TextField } from "@/components/TextField";

const cn = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

const dayLabels = ["S", "M", "T", "W", "Th", "F", "Sa"];

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const formatInputValue = (date: Date | null | undefined) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).padStart(4, "0");
  return `${day}/${month}/${year}`;
};

const maskDateInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (digits.length <= 2) {
    return day;
  }
  if (digits.length <= 4) {
    return [day, month].filter(Boolean).join("/");
  }
  return [day, month, year].filter(Boolean).join("/");
};

const parseInputValue = (value: string) => {
  const [dayStr, monthStr, yearStr] = value.split("/");

  if (!dayStr || !monthStr || !yearStr) {
    return null;
  }

  if (dayStr.length !== 2 || monthStr.length !== 2 || yearStr.length !== 4) {
    return null;
  }

  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if ([day, month, year].some((part) => Number.isNaN(part))) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const buildCalendarGrid = (current: Date) => {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let i = 0; i < startDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
};

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  placeholder = "Select date",
  disabled,
  className,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = React.useState<Date | null>(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;
  const [inputValue, setInputValue] = React.useState(() => formatInputValue(selectedValue));
  const [viewDate, setViewDate] = React.useState(() => {
    const base = selectedValue ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    const base = selectedValue ?? new Date();
    setViewDate(new Date(base.getFullYear(), base.getMonth(), 1));
  }, [selectedValue, open]);

  React.useEffect(() => {
    setInputValue(formatInputValue(selectedValue));
  }, [selectedValue]);

  const handleSelect = (day: Date | null) => {
    if (!day || disabled) {
      return;
    }
    if (value === undefined) {
      setInternalValue(day);
    }
    onChange?.(day);
    setOpen(false);
  };

  const goToMonth = (offset: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(maskDateInput(event.target.value));
  };

  const commitInputValue = () => {
    if (!inputValue) {
      setInputValue(formatInputValue(selectedValue));
      return;
    }

    const parsed = parseInputValue(inputValue);

    if (!parsed) {
      setInputValue(formatInputValue(selectedValue));
      return;
    }

    handleSelect(parsed);
  };

  const handleInputBlur = () => {
    commitInputValue();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitInputValue();
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className={cn("w-full", disabled && "pointer-events-none")}>
          <TextField
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            inputMode="numeric"
            autoComplete="off"
            trailingVisual={<CalendarIcon className="h-4 w-4 text-gray-500" />}
            fieldClassName={className}
          />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="z-50 w-[280px] rounded-2xl border border-gray-200 bg-white p-4 shadow-xl focus-visible:outline-none"
        >
          
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <div className="text-sm font-medium text-gray-900">
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  year: "numeric",
                }).format(viewDate)}
              </div>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
            <div
              className="mt-4 grid gap-1 text-center text-xs text-gray-400"
              style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
              {dayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div
              className="mt-2 grid gap-1"
              style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
            >
              {buildCalendarGrid(viewDate).map((day, index) => {
                const isSelected =
                  day &&
                  selectedValue &&
                  day.getFullYear() === selectedValue.getFullYear() &&
                  day.getMonth() === selectedValue.getMonth() &&
                  day.getDate() === selectedValue.getDate();

                return (
                  <button
                    type="button"
                    key={index}
                    disabled={!day}
                    onClick={() => handleSelect(day)}
                    className={cn(
                      "h-10 rounded-xl text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 disabled:cursor-default disabled:bg-transparent disabled:text-gray-300",
                      isSelected
                        ? "bg-gray-900 text-white hover:bg-black"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {day ? day.getDate() : ""}
                  </button>
                );
              })}
            </div>

        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
