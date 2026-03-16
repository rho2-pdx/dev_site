// Journal data loaded from markdown files
// Each .md file in the journal/ directory represents one month
// Daily entries are parsed from these files

export interface JournalEntryData {
  title?: string;
  content: string;
}

// Import the markdown parser utilities
export {
  loadAllJournalEntries,
  parseMonthlyFile,
  generateMonthlyTemplate,
  ensureMonthlyFileExists,
  isValidDate,
  getMonthPrefix,
} from "./utils";

// For backward compatibility and simple use cases
// This provides a static fallback - entries should be loaded via loadAllJournalEntries()
export const journalEntries: Record<string, JournalEntryData> = {};

export function getTotalEntries(
  entries: Record<string, JournalEntryData> = journalEntries,
): number {
  return Object.keys(entries).length;
}

export function getEntryDates(
  entries: Record<string, JournalEntryData> = journalEntries,
): string[] {
  return Object.keys(entries).sort();
}

export function getEntriesForMonth(
  year: number,
  month: number,
  entries: Record<string, JournalEntryData> = journalEntries,
): string[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return Object.keys(entries)
    .filter((date) => date.startsWith(prefix))
    .sort();
}
