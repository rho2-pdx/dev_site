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
    <div className="journal-cal-wrapper">
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={onMonthChange}
        selected={
          selectedDate ? new Date(selectedDate + "T12:00:00") : undefined
        }
        onDayClick={handleDayClick}
        modifiers={{
          hasEntry: entryDates.map((d) => new Date(d + "T12:00:00")),
        }}
        modifiersClassNames={{
          hasEntry: "rdp-has-entry",
        }}
      />
      <style jsx global>{`
        .journal-cal-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
        }

        .journal-cal-wrapper .rdp-root {
          --rdp-accent-color: var(--color-accent);
          --rdp-accent-background-color: var(--color-accent);
          --rdp-day-height: 44px;
          --rdp-day-width: 44px;
          --rdp-selected-border: 0;
          --rdp-outside-opacity: 0.2;
          --rdp-today-color: var(--color-accent);

          background-color: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: 2rem 2.25rem;
          color: var(--color-text);
          width: 100%;
        }

        /* Month/year caption */
        .journal-cal-wrapper .rdp-month_caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .journal-cal-wrapper .rdp-caption_label {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
          letter-spacing: -0.02em;
          font-family: var(--font-display);
        }

        /* Nav arrows */
        .journal-cal-wrapper .rdp-chevron {
          fill: var(--color-text-muted);
          width: 22px;
          height: 22px;
        }

        .journal-cal-wrapper .rdp-nav {
          display: flex;
          gap: 0.25rem;
        }

        .journal-cal-wrapper .rdp-button_previous,
        .journal-cal-wrapper .rdp-button_next {
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          transition: background-color 0.15s ease;
        }

        .journal-cal-wrapper .rdp-button_previous:hover,
        .journal-cal-wrapper .rdp-button_next:hover {
          background-color: var(--color-surface);
        }

        /* Weekday headers */
        .journal-cal-wrapper .rdp-weekday {
          color: var(--color-text-muted);
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding-bottom: 0.75rem;
          font-family: var(--font-display);
        }

        /* Grid spacing */
        .journal-cal-wrapper .rdp-month_grid {
          border-collapse: separate;
          border-spacing: 8px 8px;
        }

        /* Day button — dim by default */
        .journal-cal-wrapper .rdp-day_button {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--color-text-muted);
          opacity: 0.35;
          cursor: default;
          transition: all 0.15s ease;
          border: 2px solid transparent;
        }

        /* Today marker */
        .journal-cal-wrapper .rdp-today .rdp-day_button {
          color: var(--color-accent);
          opacity: 0.5;
        }

        /* Days with entries — bright and interactive */
        .journal-cal-wrapper .rdp-has-entry .rdp-day_button {
          color: var(--color-accent);
          opacity: 1;
          font-weight: 600;
          background-color: rgba(100, 181, 246, 0.08);
          border-color: var(--color-accent-dim);
          cursor: pointer;
        }

        .journal-cal-wrapper .rdp-has-entry .rdp-day_button:hover {
          background-color: rgba(100, 181, 246, 0.18);
          border-color: var(--color-accent);
        }

        /* Selected day */
        .journal-cal-wrapper .rdp-selected .rdp-day_button {
          color: #fff !important;
          opacity: 1 !important;
          font-weight: 700;
          background-color: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
