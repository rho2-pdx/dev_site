// API route to serve journal entries from markdown files
// GET /api/journal - Returns all journal entries as JSON
// GET /api/journal?date=YYYY-MM-DD - Returns a specific entry by date

import { NextResponse } from "next/server";
import { loadAllJournalEntries } from "../../journal/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  try {
    const entries = await loadAllJournalEntries();

    // If date parameter is provided, return specific entry
    if (date) {
      const entry = entries[date];

      if (!entry) {
        return NextResponse.json(
          { error: `No entry found for date: ${date}` },
          { status: 404 },
        );
      }

      return NextResponse.json(
        {
          date,
          entry,
        },
        {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        },
      );
    }

    // No date parameter - return all entries
    return NextResponse.json(
      {
        entries,
        count: Object.keys(entries).length,
        dates: Object.keys(entries).sort(),
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error loading journal entries:", error);

    // Return error response
    if (date) {
      return NextResponse.json(
        { error: "Failed to load journal entry" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        entries: {},
        count: 0,
        dates: [],
        error: "Failed to load journal entries",
      },
      { status: 500 },
    );
  }
}
