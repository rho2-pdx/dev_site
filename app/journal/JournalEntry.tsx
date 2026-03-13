"use client";

import { useState, useCallback } from "react";

interface JournalEntryProps {
  date: string;
  entry: {
    title?: string;
    content: string;
  } | null;
  onEdit: (date: string, content: string) => void;
  onDelete: (date: string) => void;
  onClose: () => void;
}

export default function JournalEntry({
  date,
  entry,
  onEdit,
  onDelete,
  onClose,
}: JournalEntryProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry?.content || "");
  const [editTitle, setEditTitle] = useState(entry?.title || "");

  const formatDateDisplay = (dateStr: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    }).format(new Date(dateStr));
  };

  const handleSave = useCallback(() => {
    if (editContent.trim()) {
      onEdit(date, editContent);
      setIsEditing(false);
    }
  }, [date, editContent, onEdit]);

  const handleCancel = useCallback(() => {
    setEditContent(entry?.content || "");
    setEditTitle(entry?.title || "");
    setIsEditing(false);
  }, [entry]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleCancel]
  );

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
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Add a title..."
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-display)",
              }}
              onKeyDown={handleKeyDown}
            />
          ) : entry?.title ? (
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
                fontFamily: "var(--font-display)",
              }}
            >
              {entry.title}
            </p>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {!isEditing && entry && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  color: "var(--color-accent)",
                  backgroundColor: "transparent",
                  border: "1px solid var(--color-accent-dim)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(date)}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
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
                Delete
              </button>
            </>
          )}
          <button
            onClick={onClose}
            style={{
              padding: "0.375rem",
              fontSize: "1rem",
              color: "var(--color-text-muted)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "color 0.15s ease",
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="What did you work on today?"
            rows={10}
            style={{
              width: "100%",
              minHeight: "200px",
              padding: "1rem",
              fontSize: "0.9rem",
              fontFamily: "var(--font-body)",
              color: "var(--color-text)",
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              resize: "vertical",
              outline: "none",
            }}
            onKeyDown={handleKeyDown}
          />
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "1rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                padding: "0.5rem 1rem",
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
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editContent.trim()}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.85rem",
                fontFamily: "var(--font-display)",
                fontWeight: 500,
                color: "var(--color-bg)",
                backgroundColor: editContent.trim()
                  ? "var(--color-accent)"
                  : "var(--color-border)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: editContent.trim() ? "pointer" : "not-allowed",
                transition: "all 0.15s ease",
              }}
            >
              Save Entry
            </button>
          </div>
        </div>
      ) : entry ? (
        <div
          style={{
            lineHeight: 1.7,
            color: "var(--color-text)",
            fontSize: "0.9rem",
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
                marginTop: "0.75rem",
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
            padding: "2rem 1rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
            No entry for this day yet.
          </p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              padding: "0.625rem 1.25rem",
              fontSize: "0.85rem",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              color: "var(--color-accent)",
              backgroundColor: "transparent",
              border: "1px solid var(--color-accent-dim)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            Create Entry
          </button>
        </div>
      )}
    </div>
  );
}
