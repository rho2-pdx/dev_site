"use client";

interface JournalEntryProps {
  date: string;
  entry: {
    title?: string;
    content: string;
  } | null;
}

export default function JournalEntry({ date, entry }: JournalEntryProps) {
  const formatDateDisplay = (dateStr: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    }).format(new Date(dateStr + "T12:00:00"));
  };

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        marginTop: "1.5rem",
        animation: "fadeIn 0.2s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <h2
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--color-text)",
            marginBottom: "0.25rem",
          }}
        >
          {formatDateDisplay(date)}
        </h2>
        {entry?.title && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              fontFamily: "var(--font-display)",
            }}
          >
            {entry.title}
          </p>
        )}
      </div>

      {/* Content */}
      {entry ? (
        <div
          style={{
            lineHeight: 1.7,
            color: "var(--color-text)",
            fontSize: "0.95rem",
            fontFamily: "var(--font-body)",
          }}
        >
          <p style={{ whiteSpace: "pre-wrap" }}>{entry.content}</p>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "2.5rem 1.5rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "0.95rem" }}>No journal entry for this day.</p>
        </div>
      )}
    </div>
  );
}
