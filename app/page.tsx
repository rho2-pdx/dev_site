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
          you can't blame me for using Claude a little bit
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
            maxWidth: "900px",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          After 8
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
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
        </div>
      </section>

      {/* Tech snapshot */}
      <section style={{ marginBottom: "3rem" }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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

      <section style={{ marginBottom: "4rem" }}>
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
          Things I&apos;m learning
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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

      {/* GitHub */}
      <section style={{ marginBottom: "4rem" }}>
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
          GitHub
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <a
            href="https://github.com/rho2-pdx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              color: "var(--color-accent)",
            }}
          >
            github.com/rho2-pdx
          </a>
          <a
            href="https://github.com/RyanHoulberg"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              color: "var(--color-accent)",
            }}
          >
            github.com/RyanHoulberg
          </a>
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Most repos are private — coursework from my MS program that I
          can&apos;t share publicly due to academic integrity policies. Public
          projects are being added as I go.
        </p>
      </section>

      {/* LinkedIn */}
      <section style={{ marginBottom: "4rem" }}>
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
          LinkedIn
        </h2>
        <a
          href="https://linkedin.com/in/ryan-houlberg-272a0256"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.9rem",
            color: "var(--color-accent)",
          }}
        >
          linkedin.com/in/ryan-houlberg-272a0256
        </a>
      </section>

      {/* View the code */}
      <section style={{ marginBottom: "4rem" }}>
        <details
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            background: "var(--color-surface)",
          }}
        >
          <summary
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              color: "var(--color-text-muted)",
              cursor: "pointer",
              userSelect: "none",
              listStyle: "none",
            }}
          >
            view the code ↓
          </summary>
          <div style={{ marginTop: "1.25rem" }}>
            <a
              href="https://github.com/rho2-pdx/dev_site"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.85rem",
                color: "var(--color-accent)",
                display: "block",
                marginBottom: "1.5rem",
              }}
            >
              github.com/rho2-pdx/dev_site →
            </a>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              Stack
            </p>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
                lineHeight: 2,
                paddingLeft: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <li>Next.js 15 (App Router) — main site</li>
              <li>Flask + Gunicorn — containerized project apps</li>
              <li>nginx — reverse proxy, SSL termination</li>
              <li>Docker Compose — orchestration</li>
              <li>GitHub Actions — CI/CD to VPS</li>
            </ul>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              What&apos;s next
            </p>
            <ul
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-muted)",
                lineHeight: 2,
                paddingLeft: "0",
                listStyle: "none",
              }}
            >
              <li>✅ Poem generator project</li>
              <li>✅ Auto-deploy on push to main</li>
              <li>☐ About page with photos</li>
              <li>☐ More projects</li>
              <li>☐ Mobile nav</li>
            </ul>
          </div>
        </details>
      </section>
    </div>
  );
}
