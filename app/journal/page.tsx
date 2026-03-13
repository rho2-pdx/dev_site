"use client";

import { useState } from "react";
import Calendar from "./Calendar";
import JournalEntry from "./JournalEntry";
import { journalEntries } from "./data";

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const dates = Object.keys(journalEntries).sort();
    return dates.length > 0 ? dates[0] : null;
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    return new Date(now);
  });

  // Get all dates with entries for the current month
  const getEntryDatesForMonth = (monthDate: Date): string[] => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const entryDates: string[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (journalEntries[dateStr]) {
        entryDates.push(dateStr);
      }
    }

    return entryDates;
  };

  const handleSelectDate = (dateStr: string) => {
    setSelectedDate(dateStr);
  };

  const handleClose = () => {
    setSelectedDate(null);
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
  };

  const entryDates = getEntryDatesForMonth(currentMonth);
  const selectedEntry = selectedDate ? journalEntries[selectedDate] : null;

  return (
    <div style={{ paddingTop: "4rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "0.5rem",
          }}
        >
          Daily Journal
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          A collection of thoughts, projects, and learnings
        </p>
      </div>

      {/* Calendar Section */}
      <section aria-label="Calendar" style={{ marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            marginBottom: "1.5rem",
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Browse Entries
        </h2>
        <Calendar
          selectedDate={selectedDate}
          entryDates={entryDates}
          onSelectDate={handleSelectDate}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
      </section>

      {/* Journal Entry Section */}
      {selectedDate && (
        <section
          aria-label="Journal Entry"
          style={{ animation: "slideIn 0.3s ease-out" }}
        >
          <style jsx>{`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <JournalEntry
            date={selectedDate}
            entry={
              selectedEntry
                ? {
                    title: selectedEntry.title,
                    content: selectedEntry.content,
                  }
                : null
            }
            onClose={handleClose}
          />
        </section>
      )}
    </div>
  );
}
