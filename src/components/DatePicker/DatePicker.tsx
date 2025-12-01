"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@radix-ui/react-icons";

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

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-900 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 disabled:cursor-not-allowed disabled:opacity-70",
            className
          )}
        >
          <span className={cn(!selectedValue && "text-gray-400")}>
            {selectedValue ? formatDate(selectedValue) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 text-gray-500" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
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
