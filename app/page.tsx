import Link from "next/link";

export default function Home() {
  return (
    <div style={{ paddingTop: "4rem" }}>
      {/* Hero */}
      <section style={{ marginBottom: "5rem" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-accent)",
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
          }}
        >
          this site is far from ready
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
          }}
        >
          Ryan Houlberg
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--color-text-muted)",
            maxWidth: "550px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          I'm partway through a MS in Computer Science but I have to switch
          schools so I finally have time to make a dev site and work on
          assembling my projects. This site was slopped together with AI and it
          does not work yet.
        </p>

        {/* <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/projects"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.25rem",
              background: "var(--color-accent-dim)",
              color: "var(--color-text)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              transition: "background 0.15s ease",
            }}
          >
            view projects →
          </Link>
          <Link
            href="/about"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.25rem",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              transition: "all 0.15s ease",
            }}
          >
            about me
          </Link>
        </div> */}
      </section>

      {/* Tech snapshot */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
          }}
        >
          Things I feel confident with
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {[
            "C++",
            "Java",
            "RESTful APIs",
            "Networking",
            "Improv Comedy",
            "Linux",
            "git",
            "Python",
            "llama.cpp",
            "Test Driven Development",
            "SQL",
          ].map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.35rem 0.75rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
      <section>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1.25rem",
            marginTop: "1rem",
          }}
        >
          Things I'm learning
        </h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {["Rust", "Typescript", "Next.js", "WASM"].map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.35rem 0.75rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
