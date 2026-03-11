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
            marginBottom: "1rem",
          }}
        >
          Upload an image and get a poem generated from lyrics matching what it
          sees.
        </p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {[
            { src: "/media/python-5.svg", label: "Python" },
            { src: "/media/flask.svg", label: "Flask" },
            { src: "/media/gunicorn.svg", label: "Gunicorn" },
          ].map(({ src, label }) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <img
                src={src}
                alt={label}
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </a>
    </div>
  );
}
