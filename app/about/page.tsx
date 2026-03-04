export default function About() {
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
        About
      </h1>

      {/* Placeholder for photos */}
      <section style={{ marginBottom: "3rem" }}>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display)",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          photo soon
        </div>
      </section>

      {/* Bio */}
      <section style={{ marginBottom: "3rem", maxWidth: "680px" }}>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
            marginBottom: "1.25rem",
          }}
        >
          I'm going to bed rn but this page is up
        </p>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
          }}
        >
          LLMs don't know how to be funny i swear
        </p>
      </section>
    </div>
  );
}
