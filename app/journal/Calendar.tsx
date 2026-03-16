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
  const handleDayClick = (date: Date | null, modifiers: Modifiers) => {
    if (!date || modifiers.disabled) return;
    const dateStr = date.toISOString().split("T")[0];
    onSelectDate(dateStr);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={onMonthChange}
        selected={
          selectedDate ? new Date(selectedDate + "T12:00:00") : undefined
        }
        onDayClick={handleDayClick}
        modifiers={{
          hasEntry: entryDates.map((date) => new Date(date + "T12:00:00")),
          selected: selectedDate
            ? new Date(selectedDate + "T12:00:00")
            : undefined,
        }}
        modifiersStyles={{
          hasEntry: {
            backgroundColor: "var(--color-surface)",
            color: "var(--color-accent)",
            fontWeight: 600,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: "var(--color-accent-dim)",
          },
          selected: {
            borderWidth: "3px",
            borderStyle: "solid",
            borderColor: "var(--color-accent)",
            backgroundColor: "var(--color-bg-secondary)",
          },
        }}
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "2.5rem",
          color: "var(--color-text)",
          width: "100%",
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
      <style jsx>{`
        .calendar-root {
          --rdp-accent: var(--color-accent);
          --rdp-accent-mix: var(--color-accent-dim);
          --rdp-background: var(--color-surface);
          --rdp-accent-chroma: 0.75;
          --rdp-cell-size: 48px;
        }

        .calendar-root :global(.rdp-month_caption) {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          gap: 0;
        }

        .calendar-root :global(.rdp-caption_label) {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text);
          flex: 1;
          letter-spacing: -0.02em;
        }

        .calendar-root :global(.rdp-chevron) {
          color: white;
          fill: currentColor;
          width: 28px;
          height: 28px;
        }

        .calendar-root :global(.rdp-nav) {
          display: flex;
          gap: 0.5rem;
          flex: 0 0 auto;
        }

        .calendar-root :global(.rdp-nav button) {
          padding: 0.625rem;
          border-radius: var(--radius-sm);
          transition: all 0.15s ease;
        }

        .calendar-root :global(.rdp-nav button):hover {
          background-color: var(--color-surface);
        }

        .calendar-root :global(.rdp-today) {
          color: var(--color-accent);
          font-weight: 600;
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
          font-size: 1rem;
          cursor: pointer;
          min-height: 48px;
          min-width: 48px;
        }

        .calendar-root :global(.rdp-day_button):hover {
          background-color: var(--color-surface-hover);
          color: var(--color-accent);
        }

        .calendar-root :global(.rdp-day_button.selected) {
          border: 3px solid var(--color-accent) !important;
          background-color: var(--color-bg-secondary) !important;
          color: var(--color-text) !important;
          font-weight: 700;
        }

        .calendar-root :global(.rdp-day_button.hasEntry) {
          background-color: var(--color-surface);
          color: var(--color-accent);
          font-weight: 600;
          border: 2px solid var(--color-accent-dim);
          border-radius: 50%;
        }

        .calendar-root :global(.rdp-day_button.hasEntry):hover {
          background-color: var(--color-accent-dim);
          color: white;
          border-color: var(--color-accent);
        }

        .calendar-root :global(.rdp-weekday) {
          color: var(--color-text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding-bottom: 0.75rem;
        }

        .calendar-root :global(.rdp-month_grid) {
          margin: 0;
          border-collapse: separate;
          border-spacing: 0.5rem 0.75rem;
        }

        .calendar-root :global(.rdp-head_cell),
        .calendar-root :global(.rdp-cell) {
          padding: 0;
        }
      `}</style>
    </div>
  );
}
