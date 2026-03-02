export default function Projects() {
  return (
    <div style={{ paddingTop: "4rem" }}>
      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "2rem",
          letterSpacing: "-0.03em",
        }}
      >
        Projects
      </h1>
      <a
        href="/projects/poem-generator/"
        style={{
          display: "block",
          padding: "1.25rem",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          transition: "border-color 0.15s ease",
        }}
      >
        <h2
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Poem Generator
        </h2>
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--color-text-muted)",
          }}
        >
          Upload an image and get a poem generated from lyrics matching what it
          sees.
        </p>
      </a>
    </div>
  );
}
