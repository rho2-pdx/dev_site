"use client";

import { useState, useEffect, useCallback } from "react";
import Calendar from "./Calendar";
import JournalEntry from "./JournalEntry";
import { JournalEntryData } from "./data";

export default function JournalPage() {
  const [entries, setEntries] = useState<Record<string, JournalEntryData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    return new Date(now);
  });

  // Load journal entries from API on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const response = await fetch("/api/journal");
        if (!response.ok) {
          throw new Error("Failed to load journal entries");
        }
        const data = await response.json();
        setEntries(data.entries || {});

        // Set first entry as default selection
        const sortedDates = Object.keys(data.entries || {}).sort();
        if (sortedDates.length > 0) {
          setSelectedDate(sortedDates[0]);
        }
      } catch (error) {
        console.error("Error loading journal entries:", error);
        setEntries({});
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  // Get all dates with entries for the current month
  const getEntryDatesForMonth = useCallback(
    (monthDate: Date): string[] => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const entryDates: string[] = [];
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (entries[dateStr]) {
          entryDates.push(dateStr);
        }
      }

      return entryDates;
    },
    [entries],
  );

  const handleSelectDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedDate(null);
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const entryDates = getEntryDatesForMonth(currentMonth);
  const selectedEntry = selectedDate ? entries[selectedDate] : null;

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div style={{ paddingTop: "4rem", textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--color-text-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Loading journal entries...
        </p>
      </div>
    );
  }

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

      {/* No entries message */}
      {Object.keys(entries).length === 0 && !selectedDate && (
        <section
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "0.95rem" }}>
            No journal entries yet. Add entries to your monthly markdown files
            to see them here.
          </p>
        </section>
      )}
    </div>
  );
}
