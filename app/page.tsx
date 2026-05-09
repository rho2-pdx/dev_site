import Link from "next/link";

const skills = [
  "C++",
  "Java",
  "Python",
  "RESTful APIs",
  "Linux",
  "git",
  "Docker",
  "Docker Compose",
  "Flask",
  "Test Driven Development",
  "llama.cpp",
  "Google Cloud APIs",
  "CI/CD",
  "SQL",
  "Rust",
  "TypeScript",
  "Next.js",
  "React",
  "WASM",
  "nginx",
  "Tailwind CSS",
];

export default function Home() {
  return (
    <div style={{ paddingTop: "3rem" }}>
      {/* Hero */}
      <section style={{ marginBottom: "4rem" }}>
        <p
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-accent)",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
          }}
        >
          i can't bring myself to say i'm an AI native
        </p>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            letterSpacing: "-0.03em",
            color: "var(--color-text)",
          }}
        >
          Ryan Houlberg
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "var(--color-text-muted)",
            maxWidth: "740px",
            lineHeight: 1.75,
            marginBottom: "2.5rem",
          }}
        >
          After 8 &ldquo;grad prep&rdquo; classes and 7 graduate classes at
          Portland State (3.93 graduate GPA btw), I&apos;ve transferred to
          Georgia Tech&apos;s OMSCS program. Since classes don&apos;t start
          until the Fall, I finally have time for crushing projects! I hope to
          do fun stuff, show it off, and learn through repetitive
          inconsequential failure (off the job training)
        </p>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link
            href="/projects"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.25rem",
              background: "var(--color-accent)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              fontWeight: 600,
              transition: "background 0.15s ease",
            }}
          >
            view projects &rarr;
          </Link>
          <Link
            href="/about"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.25rem",
              border: "2px solid var(--color-border)",
              color: "var(--color-text)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-display)",
              fontSize: "0.85rem",
              fontWeight: 500,
              transition: "all 0.15s ease",
            }}
          >
            about me
          </Link>
        </div>
      </section>

      {/* Links row — GitHub + LinkedIn side by side */}
      <section
        style={{
          marginBottom: "4rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div
          style={{
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
            }}
          >
            GitHub
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
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
                  fontSize: "0.85rem",
                  color: "var(--color-accent)",
                  fontWeight: 500,
                }}
              >
                <img
                  src="/media/github-icon-1.svg"
                  alt="GitHub"
                  style={{ width: "18px", height: "18px", opacity: 0.6 }}
                />
                github.com/{handle}
              </a>
            ))}
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              marginTop: "0.75rem",
            }}
          >
            Lots of repos are private due to academic honesty policies. I&apos;m
            reviewing and integrating each project into this main dev site repo
            as I go.
          </p>
        </div>
        <div
          style={{
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.8rem",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "1rem",
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
              fontSize: "0.85rem",
              color: "var(--color-accent)",
              fontWeight: 500,
            }}
          >
            <img
              src="/media/linkedin-icon-2.svg"
              alt="LinkedIn"
              style={{ width: "18px", height: "18px", opacity: 0.6 }}
            />
            linkedin.com/in/ryan-houlberg
          </a>
        </div>
      </section>

      {/* Architecture */}
      <section style={{ marginBottom: "4rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          How this site works
        </h2>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
          }}
        >
          Every push to main auto-deploys via{" "}
          <a
            href="https://github.com/rho2-pdx/dev_site"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-accent)", fontWeight: 500 }}
          >
            GitHub Actions
          </a>
        </p>

        <div
          style={{
            background: "var(--color-surface)",
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "2rem",
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
          }}
        >
          {/* Row 1: Cloudflare */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                padding: "0.6rem 1.5rem",
                border: "2px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg)",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
                Cloudflare
              </div>
              <div
                style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
              >
                DNS + SSL + CDN
              </div>
            </div>
          </div>

          {/* Connector */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "24px",
                background: "var(--color-border)",
              }}
            />
          </div>

          {/* Row 2: VPS */}
          <div
            style={{
              border: "2px solid var(--color-accent)",
              borderRadius: "var(--radius-lg)",
              padding: "1.25rem",
              background: "var(--color-accent-light)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{ fontWeight: 700, color: "var(--color-accent-dim)" }}
              >
                Hetzner VPS
              </div>
              <div
                style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}
              >
                Germany &middot; Docker Compose
              </div>
            </div>

            {/* nginx */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "0.5rem 1.25rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--color-text)" }}>
                  nginx
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  reverse proxy &middot; SSL termination
                </div>
              </div>
            </div>

            {/* Connector splitting */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "16px",
                  background: "var(--color-border)",
                }}
              />
            </div>

            {/* Horizontal connector bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "0.5rem",
                padding: "0 4rem",
              }}
            >
              <div
                style={{
                  height: "2px",
                  background: "var(--color-border)",
                  width: "100%",
                  position: "relative",
                }}
              >
                {/* Drops — one per upstream container */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "2px",
                    height: "16px",
                    background: "var(--color-border)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "33.33%",
                    top: 0,
                    width: "2px",
                    height: "16px",
                    background: "var(--color-border)",
                    transform: "translateX(-50%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "66.66%",
                    top: 0,
                    width: "2px",
                    height: "16px",
                    background: "var(--color-border)",
                    transform: "translateX(-50%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "2px",
                    height: "16px",
                    background: "var(--color-border)",
                  }}
                />
              </div>
            </div>

            {/* Containers row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                gap: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              <div
                style={{
                  padding: "0.75rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Next.js
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  portfolio site
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.35rem",
                    fontStyle: "italic",
                  }}
                >
                  :3000
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Flask
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  poem generator
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.35rem",
                    fontStyle: "italic",
                  }}
                >
                  :5000
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Jetty
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  airline web
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.35rem",
                    fontStyle: "italic",
                  }}
                >
                  :8080
                </div>
              </div>
              <div
                style={{
                  padding: "0.75rem",
                  border: "2px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--color-surface)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: "var(--color-text)",
                    marginBottom: "0.15rem",
                  }}
                >
                  Axum
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  cookery
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--color-text-muted)",
                    marginTop: "0.35rem",
                    fontStyle: "italic",
                  }}
                >
                  :8081
                </div>
              </div>
            </div>

            {/* Shared assets note */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.5rem 0.75rem",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.7rem",
                color: "var(--color-text-muted)",
                textAlign: "center",
              }}
            >
              shared design tokens served by nginx at /shared/styles.css
            </div>
          </div>

          {/* CI/CD note */}
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              color: "var(--color-text-muted)",
            }}
          >
            <span>push to main</span>
            <span style={{ color: "var(--color-border)" }}>&rarr;</span>
            <span>GitHub Actions</span>
            <span style={{ color: "var(--color-border)" }}>&rarr;</span>
            <span>SSH deploy</span>
            <span style={{ color: "var(--color-border)" }}>&rarr;</span>
            <span>docker compose up</span>
          </div>
        </div>
      </section>

      <section
        style={{
          marginBottom: "4rem",
          background: "var(--color-surface)",
          border: "2px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "1rem",
          }}
        >
          Skills
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {skills.map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.3rem 0.65rem",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-display)",
                fontSize: "0.75rem",
                color: "var(--color-text)",
                fontWeight: 500,
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
