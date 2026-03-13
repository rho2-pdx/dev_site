"use client";

import { useState } from "react";

interface JournalEntryProps {
  date: string;
  entry: {
    title?: string;
    content: string;
  } | null;
  onClose: () => void;
}

export default function JournalEntry({
  date,
  entry,
  onClose,
}: JournalEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDateDisplay = (dateStr: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    }).format(new Date(dateStr));
  };

  const getPreviewText = (content: string): string => {
    return content.length > 200 ? content.substring(0, 200) + "..." : content;
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div>
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
        <button
          onClick={onClose}
          style={{
            padding: "0.375rem 0.625rem",
            fontSize: "0.85rem",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Close
        </button>
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
          {isExpanded ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{entry.content}</p>
          ) : (
            <p>{getPreviewText(entry.content)}</p>
          )}
          {entry.content.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 0",
                fontSize: "0.85rem",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--color-accent)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              {isExpanded ? "Read less ↑" : "Read more ↓"}
            </button>
          )}
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
