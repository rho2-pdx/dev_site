"use client";

import { DayPicker, Modifiers } from "react-day-picker";
import "react-day-picker/style.css";

interface CalendarProps {
  selectedDate: string | null;
  entryDates: string[];
  onSelectDate: (dateStr: string) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export default function Calendar({
  selectedDate,
  entryDates,
  onSelectDate,
  currentMonth,
  onMonthChange,
}: CalendarProps) {
  const hasEntry = (date: Date): boolean => {
    const dateStr = date.toISOString().split("T")[0];
    return entryDates.includes(dateStr);
  };

  const handleDayClick = (date: Date | null, modifiers: Modifiers) => {
    if (!date || modifiers.disabled) return;
    const dateStr = date.toISOString().split("T")[0];
    onSelectDate(dateStr);
  };

  return (
    <div style={{ position: "relative" }}>
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={onMonthChange}
        selected={
          selectedDate
            ? new Date(selectedDate + "T12:00:00")
            : new Date(
                new Date().toLocaleString("en-US", {
                  timeZone: "America/Los_Angeles",
                }),
              )
        }
        onDayClick={handleDayClick}
        modifiers={{
          hasEntry: entryDates.map((date) => new Date(date + "T12:00:00")),
        }}
        modifiersStyles={{
          hasEntry: {
            backgroundColor: "var(--color-surface)",
            color: "var(--color-accent)",
            fontWeight: 600,
            border: "1px solid var(--color-accent-dim)",
          },
        }}
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          color: "var(--color-text)",
        }}
        classNames={{
          root: "calendar-root",
          month_caption: "calendar-caption",
          nav: "calendar-nav",
          table: "calendar-table",
          head: "calendar-head",
          head_row: "calendar-head-row",
          head_cell: "calendar-head-cell",
          weekdays: "calendar-weekdays",
          weekday: "calendar-weekday",
          month_grid: "calendar-month-grid",
          row: "calendar-row",
          cell: "calendar-cell",
          day: "calendar-day",
          day_button: "calendar-day-button",
        }}
      />

      {/* Custom CSS for react-day-picker styling */}
      <style jsx>{`
        .calendar-root {
          --rdp-accent: var(--color-accent);
          --rdp-accent-mix: var(--color-accent-dim);
          --rdp-background: var(--color-surface);
          --rdp-accent-chroma: 0.75;
          --rdp-cell-size: 40px;
        }

        .calendar-root :global(.rdp-caption_label) {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .calendar-root :global(.rdp-chevron) {
          color: var(--color-accent);
          fill: currentColor;
        }

        .calendar-root :global(.rdp-today) {
          color: var(--color-accent);
        }

        .calendar-root :global(.rdp-day_button) {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.15s ease;
          color: var(--color-text);
          font-family: var(--font-display);
          font-size: 0.9rem;
        }

        .calendar-root :global(.rdp-day_button):hover {
          background-color: var(--color-surface-hover);
          color: var(--color-accent);
        }

        .calendar-root :global(.rdp-day_button[aria-selected]) {
          background-color: var(--color-accent) !important;
          color: var(--color-bg) !important;
          font-weight: 600;
        }

        .calendar-root :global(.rdp-day_button.hasEntry) {
          background-color: var(--color-surface);
          color: var(--color-accent);
          font-weight: 600;
          border: 1px solid var(--color-accent-dim);
          border-radius: 50%;
        }

        .calendar-root :global(.rdp-day_button.hasEntry):hover {
          background-color: var(--color-accent-dim);
          color: white;
          border-color: var(--color-accent);
        }

        .calendar-root :global(.rdp-weekday) {
          color: var(--color-text-muted);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .calendar-root :global(.rdp-month_grid) {
          margin: 1rem 0 0;
        }
      `}</style>
    </div>
  );
}
