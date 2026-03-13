// Journal entry interface
export interface JournalEntry {
  date: string; // ISO date string (YYYY-MM-DD) in PST
  title?: string;
  content: string;
  tags?: string[];
}

// Storage key for localStorage
export const JOURNAL_STORAGE_KEY = 'journal_entries';

// Get today's date in PST timezone as YYYY-MM-DD
export function getPSTDate(date = new Date()): string {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }))
    .toISOString()
    .split('T')[0];
}

// Format date for display
export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  }).format(date);
}

// Check if two dates are the same day
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

// Get journal entries from localStorage
export function getJournalEntries(): Record<string, JournalEntry> {
  try {
    const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading journal entries:', error);
    return {};
  }
}

// Save journal entries to localStorage
export function saveJournalEntries(entries: Record<string, JournalEntry>): void {
  try {
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entries:', error);
  }
}

// Add or update a journal entry
export function addJournalEntry(
  date: string,
  entry: Omit<JournalEntry, 'date'>
): Record<string, JournalEntry> {
  const entries = getJournalEntries();
  entries[date] = { date, ...entry };
  saveJournalEntries(entries);
  return entries;
}

// Delete a journal entry
export function deleteJournalEntry(date: string): Record<string, JournalEntry> {
  const entries = getJournalEntries();
  delete entries[date];
  saveJournalEntries(entries);
  return entries;
}

// Get all dates with entries in a given month
export function getEntriesForMonth(
  year: number,
  month: number, // 0-indexed
  entries: Record<string, JournalEntry>
): string[] {
  const entryDates: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (entries[dateStr]) {
      entryDates.push(dateStr);
    }
  }

  return entryDates;
}

// Get current month and year in PST timezone
export function getCurrentMonthYear(date = new Date()): { year: number; month: number } {
  const pstDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
  return {
    year: pstDate.getFullYear(),
    month: pstDate.getMonth(), // 0-indexed
  };
}
