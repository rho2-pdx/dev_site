import Image from "next/image";

const projects = [
  {
    name: "Cookery",
    href: "/projects/cookery/",
    description:
      "family cookbook application, updated with the power of vibes to be more intuitive and easier to use",
    stack: [
      { src: "/media/rust.svg", label: "Rust" },
      { src: "/media/axum.svg", label: "Axum" },
      { src: "/media/postgres.svg", label: "Postgres" },
    ],
  },
  {
    name: "Airline Web",
    href: "/projects/airline-web/",
    description:
      "REST API for managing airlines and flights. Add flights, search by route, and get XML responses. Built for 'Joy of Coding' class at PSU.",
    stack: [
      { src: "/media/java.svg", label: "Java 17" },
      { src: "/media/jetty.svg", label: "Jetty" },
      { src: "/media/rest.svg", label: "REST" },
    ],
  },
  {
    name: "Poem Generator",
    href: "/projects/poem-generator/",
    description:
      "Upload an image to generate keywords, which are used to extract lyrics from songs and make an eloquent poem \"every single time\". Built for 'Web Systems' at PSU.",
    stack: [
      { src: "/media/python-5.svg", label: "Python" },
      { src: "/media/flask.svg", label: "Flask" },
      { src: "/media/gunicorn.svg", label: "Gunicorn" },
    ],
  },
];

export default function Projects() {
  return (
    <div className="pt-12">
      <h1 className="page-title mb-2">Projects</h1>
      <p className="body-text mb-10">
        More coming as I port things over from school repos.
      </p>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <a key={project.name} href={project.href} className="project-card">
            <h2 className="mb-2 text-[1.15rem] font-semibold text-[var(--color-text)]">
              {project.name}
            </h2>
            <p className="mb-5 text-[0.9rem] leading-relaxed text-[var(--color-text-muted)]">
              {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {project.stack.map(({ src, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5"
                >
                  <Image
                    src={src}
                    alt={label}
                    width={28}
                    height={28}
                    unoptimized
                    className="h-7 w-7 object-contain"
                  />
                  <span className="font-[family-name:var(--font-display)] text-[0.7rem] text-[var(--color-text-muted)]">
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
