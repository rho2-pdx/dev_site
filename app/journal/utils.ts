// Utility for parsing monthly markdown journal files
// Each .md file represents one month, with daily entries inside

import { JournalEntryData } from "./data";

interface ParsedEntry {
  date: string;
  title: string;
  content: string;
}

/**
 * Parses a single monthly markdown file and extracts all daily entries
 *
 * Expected format:
 * ```markdown
 * # March 2026
 *
 * ## 2026-03-01
 * **Title: My Entry Title**
 *
 * Content of the entry goes here.
 * It can span multiple lines and paragraphs.
 *
 * ## 2026-03-15
 * **Title: Another Entry**
 *
 * More content here...
 * ```
 */
export function parseMonthlyFile(content: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];

  // Strip HTML comments (template examples live inside <!-- --> blocks)
  const stripped = content.replace(/<!--[\s\S]*?-->/g, "");

  // Split by day headers (## YYYY-MM-DD)
  const daySections = stripped.split(/##\s+(\d{4}-\d{2}-\d{2})/);
  console.log("[Parser] daySections length:", daySections.length);

  // Skip the first element (everything before first ##)
  for (let i = 1; i < daySections.length; i += 2) {
    const date = daySections[i];
    const sectionContent = daySections[i + 1] || "";

    // Extract title from **Title: ...** or ## YYYY-MM-DD - Title: ...
    const titleMatch = sectionContent.match(/\*\*Title:\s*(.+?)\*\*/);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract content (everything after the title line)
    const contentLines = sectionContent
      .split("\n")
      .slice(1) // Skip the title line
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("**Title:"))
      .join("\n")
      .trim();

    if (date && contentLines) {
      entries.push({
        date,
        title,
        content: contentLines,
      });
    }
  }

  return entries;
}

/**
 * Reads all monthly markdown files from the journal directory
 * and returns a Record of all entries (date -> entry data)
 */
export async function loadAllJournalEntries(): Promise<
  Record<string, JournalEntryData>
> {
  try {
    const fs = await import("fs");
    const path = await import("path");

    // Path to the journal directory (relative to project root)
    const journalDir = path.join(process.cwd(), "journal");

    // Check if directory exists
    if (!fs.existsSync(journalDir)) {
      console.warn("Journal directory not found. Using empty entries.");
      return {};
    }

    // Read all .md files
    const files = fs
      .readdirSync(journalDir)
      .filter((file) => file.endsWith(".md"))
      .sort(); // Sort by filename (YYYY-MM format ensures chronological order)

    console.log("[Journal] Found files:", files);

    const allEntries: Record<string, JournalEntryData> = {};

    for (const file of files) {
      const filePath = path.join(journalDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      console.log(`[Journal] Parsing ${file}, content length:`, content.length);

      const entries = parseMonthlyFile(content);
      console.log(
        `[Journal] ${file} has ${entries.length} entries:`,
        entries.map((e) => e.date),
      );

      for (const entry of entries) {
        allEntries[entry.date] = {
          title: entry.title,
          content: entry.content,
        };
      }
    }

    console.log(
      "[Journal] Total entries loaded:",
      Object.keys(allEntries).sort(),
    );

    return allEntries;
  } catch (error) {
    console.error("Error loading journal entries:", error);
    return {};
  }
}

/**
 * Generates a template for a new monthly journal file
 */
export function generateMonthlyTemplate(year: number, month: number): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[month];
  const filename = `${year}-${String(month + 1).padStart(2, "0")}`;

  return `# ${monthName} ${year}

<!-- Add your daily entries below following this format:

## 2026-01-01
**Title: Your Entry Title**

Your daily content goes here. You can write multiple paragraphs,
use bullet points, or however you like. The title is required
to appear in the calendar preview.

Example:

## 2026-01-15
**Title: Working on a Feature**

Today I spent most of the day implementing a new feature.
The key challenges were:
- Complex state management
- Performance optimization
- Edge case handling

Overall it was a productive day!

-->

`;
}

/**
 * Creates a new monthly journal file if it doesn't exist
 */
export async function ensureMonthlyFileExists(
  year: number,
  month: number,
): Promise<void> {
  try {
    const fs = await import("fs");
    const path = await import("path");

    const journalDir = path.join(process.cwd(), "journal");
    const filename = `${year}-${String(month + 1).padStart(2, "0")}.md`;
    const filePath = path.join(journalDir, filename);

    if (!fs.existsSync(journalDir)) {
      fs.mkdirSync(journalDir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      const template = generateMonthlyTemplate(year, month);
      fs.writeFileSync(filePath, template, "utf-8");
      console.log(`Created journal file: ${filename}`);
    }
  } catch (error) {
    console.error("Error creating journal file:", error);
  }
}

/**
 * Validates a date string (YYYY-MM-DD format)
 */
export function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Gets the month prefix for a given date (YYYY-MM)
 */
export function getMonthPrefix(dateStr: string): string {
  if (!isValidDate(dateStr)) return "";
  return dateStr.substring(0, 7);
}
