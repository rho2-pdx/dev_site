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
          we should be able to use a <i>little</i> Claude at work
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
          After 8 "grad prep" classes and 6 graduate classes at Portland State,
          I've transferred to Georgia Tech's OMSCS program. Since classes don't
          start until the Fall, I finally have time for crushing projects! I
          hope to do fun stuff, show it off, and learn through repetitive
          inconsequential failure (off the job training)
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
            "Linux",
            "git",
            "Python",
            "Test Driven Development",
            "llama.cpp",
            "docker",
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
          {["Rust", "Typescript", "Next.js", "WASM", "nginx"].map((tech) => (
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
          {["rho2-pdx", "RyanHoulberg"].map((handle) => (
            <a
              key={handle}
              href={`https://github.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-display)",
                fontSize: "0.9rem",
                color: "var(--color-accent)",
              }}
            >
              <img src="/media/github-icon-1.svg" alt="GitHub" style={{ width: "18px", height: "18px", opacity: 0.7 }} />
              github.com/{handle}
            </a>
          ))}
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Lots of repos are private due to academic honesty policies and all
          that. I'm reviewing, updating, and integrating each project into this
          main dev site repo as I go. I'll be rolling this rho2 github into my
          RyanHoulberg github in a few weeks when I'm officially done at PSU
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
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-display)",
            fontSize: "0.9rem",
            color: "var(--color-accent)",
          }}
        >
          <img src="/media/linkedin-icon-2.svg" alt="LinkedIn" style={{ width: "18px", height: "18px", opacity: 0.7 }} />
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
              <li>Every part of this site is getting dockerized</li>
              <li>Next.js container as the app router</li>
              <li>Flask + Gunicorn container for the Poem Generator</li>
              <li>nginx container for reverse proxy management and SSL</li>
              <li>Managed with Docker Compose</li>
              <li>
                CI/CD automated to VPS with Github Action, every commit pushed
                to main goes live
              </li>
              <li>
                VPS running on Hetzner in Germany, with self-hosting and load
                balancing plans in the works...
              </li>
              <li>Tracking goals and progress with Obsidian</li>
              <li>
                local-hosting LLMs on my 4090 to integrate agentically with Zed
                on my dev laptop
              </li>
            </ul>
          </div>
        </details>
      </section>
    </div>
  );
}
