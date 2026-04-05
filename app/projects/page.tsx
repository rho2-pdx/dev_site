export default function Projects() {
  const projects = [
    {
      name: "Poem Generator",
      href: "/projects/poem-generator/",
      description:
        "Upload an image and get a poem generated from lyrics matching what it sees.",
      stack: [
        { src: "/media/python-5.svg", label: "Python" },
        { src: "/media/flask.svg", label: "Flask" },
        { src: "/media/gunicorn.svg", label: "Gunicorn" },
      ],
    },
    {
      name: "Airline Web (currently broken don't look)",
      href: "/projects/airline-web/",
      description:
        "REST API for managing airlines and flights. Add flights, search by route, and get XML responses. Built as a servlet web app for a grad course at Portland State.",
      stack: [
        { src: "/media/java.svg", label: "Java 17" },
        { src: "/media/jetty.svg", label: "Jetty" },
      ],
    },
  ];

  return (
    <div style={{ paddingTop: "3rem" }}>
      <h1
        style={{
          fontSize: "clamp(2rem, 4vw, 3rem)",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "0.5rem",
          letterSpacing: "-0.03em",
        }}
      >
        Projects
      </h1>
      <p
        style={{
          fontSize: "0.95rem",
          color: "var(--color-text-muted)",
          marginBottom: "2.5rem",
        }}
      >
        More coming as I port things over from school repos.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            style={{
              display: "block",
              padding: "1.5rem",
              background: "var(--color-surface)",
              border: "2px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              transition: "border-color 0.15s ease",
            }}
          >
            <h2
              style={{
                fontSize: "1.15rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "var(--color-text)",
              }}
            >
              {project.name}
            </h2>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--color-text-muted)",
                marginBottom: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              {project.description}
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {project.stack.map(({ src, label }) => (
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
                    style={{
                      width: "28px",
                      height: "28px",
                      objectFit: "contain",
                    }}
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
        ))}
      </div>
    </div>
  );
}
