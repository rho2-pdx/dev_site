// Static journal entries data
// Format: YYYY-MM-DD keys with title and content

export interface JournalEntryData {
  title?: string;
  content: string;
}

// Add your journal entries below
// Format: "YYYY-MM-DD": { title: "...", content: "..." }
// Entries will appear on the calendar and be clickable
export const journalEntries: Record<string, JournalEntryData> = {
  // Example:
  // "2024-12-25": {
  //   title: "Holiday Work",
  //   content: "What you worked on today...",
  // },
};

// Helper to get entry count
export function getTotalEntries(): number {
  return Object.keys(journalEntries).length;
}

// Helper to get dates with entries
export function getEntryDates(): string[] {
  return Object.keys(journalEntries);
}

// Helper to get entries for a specific month
export function getEntriesForMonth(year: number, month: number): string[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return Object.keys(journalEntries).filter((date) => date.startsWith(prefix));
}
