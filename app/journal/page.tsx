"use client";

import { useState, useEffect, useCallback } from "react";
import Calendar from "./Calendar";
import JournalEntry from "./JournalEntry";
import { JournalEntry as JournalEntryType } from "./types";

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
    });
    return new Date(now);
  });
  const [entries, setEntries] = useState<Record<string, JournalEntryType>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("journal_entries");
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading journal entries:", error);
    }
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
    setIsEditing(false);
  }, []);

  const handleEdit = useCallback((date: string, content: string) => {
    setEntries((prev) => {
      const updated = {
        ...prev,
        [date]: {
          ...prev[date],
          content,
          date,
        },
      };
      localStorage.setItem("journal_entries", JSON.stringify(updated));
      return updated;
    });
    setIsEditing(false);
  }, []);

  const handleDelete = useCallback(
    (date: string) => {
      if (confirm("Are you sure you want to delete this entry?")) {
        setEntries((prev) => {
          const { [date]: deleted, ...rest } = prev;
          localStorage.setItem("journal_entries", JSON.stringify(rest));
          return rest;
        });
        if (selectedDate === date) {
          setSelectedDate(null);
        }
      }
    },
    [selectedDate],
  );

  const handleClose = useCallback(() => {
    setSelectedDate(null);
    setIsEditing(false);
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  const entryDates = getEntryDatesForMonth(currentMonth);
  const selectedEntry = selectedDate ? entries[selectedDate] : null;

  return (
    <div style={{ paddingTop: "4rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem" }}>
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
          Track what you build, learn, and create every day
        </p>
      </div>

      {/* Calendar Section */}
      <section aria-label="Calendar" style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "1rem",
            fontFamily: "var(--font-display)",
          }}
        >
          Calendar
        </h2>
        <Calendar
          selectedDate={selectedDate}
          entryDates={entryDates}
          onSelectDate={handleSelectDate}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            marginTop: "0.75rem",
            fontStyle: "italic",
          }}
        >
          Days with highlighted borders have journal entries. Click any day to
          view or create an entry.
        </p>
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
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={handleClose}
          />
        </section>
      )}

      {/* Quick Stats */}
      <section
        style={{
          marginTop: "3rem",
          padding: "1.25rem",
          backgroundColor: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <h3
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "var(--color-text-muted)",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-display)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Quick Stats
        </h3>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              {Object.keys(entries).length}
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Total Entries
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              {
                getEntryDatesForMonth(
                  new Date(
                    new Date().toLocaleString("en-US", {
                      timeZone: "America/Los_Angeles",
                    }),
                  ),
                ).length
              }
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              This Month
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
