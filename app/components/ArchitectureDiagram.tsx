const services = [
  { name: "Next.js", description: "portfolio site", port: ":3000" },
  { name: "Flask", description: "poem generator", port: ":5000" },
  { name: "Jetty", description: "airline web", port: ":8080" },
  { name: "Axum", description: "cookery", port: ":8081" },
];

export default function ArchitectureDiagram() {
  return (
    <div className="diagram-panel">
      <div className="mb-2 flex justify-center">
        <div className="diagram-node">
          <div className="font-bold text-[var(--color-text)]">Cloudflare</div>
          <div className="text-[0.7rem] text-[var(--color-text-muted)]">
            DNS + SSL + CDN
          </div>
        </div>
      </div>

      <div className="diagram-vline" />

      <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-accent)] bg-[var(--color-accent-light)] p-5">
        <div className="mb-4 text-center">
          <div className="font-bold text-[var(--color-accent-dim)]">
            Hetzner VPS
          </div>
          <div className="text-[0.7rem] text-[var(--color-text-muted)]">
            Germany · Docker Compose
          </div>
        </div>

        <div className="mb-2 flex justify-center">
          <div className="diagram-node-surface">
            <div className="font-bold text-[var(--color-text)]">nginx</div>
            <div className="text-[0.7rem] text-[var(--color-text-muted)]">
              reverse proxy · SSL termination
            </div>
          </div>
        </div>

        <div className="diagram-vline-sm" />

        <div className="mb-2 hidden justify-center px-4 sm:flex sm:px-16">
          <div className="relative h-0.5 w-full bg-[var(--color-border)]">
            <div className="absolute left-0 top-0 h-4 w-0.5 bg-[var(--color-border)]" />
            <div className="absolute left-1/3 top-0 h-4 w-0.5 -translate-x-1/2 bg-[var(--color-border)]" />
            <div className="absolute left-2/3 top-0 h-4 w-0.5 -translate-x-1/2 bg-[var(--color-border)]" />
            <div className="absolute right-0 top-0 h-4 w-0.5 bg-[var(--color-border)]" />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="diagram-service">
              <div className="mb-0.5 font-bold text-[var(--color-text)]">
                {service.name}
              </div>
              <div className="text-[0.7rem] text-[var(--color-text-muted)]">
                {service.description}
              </div>
              <div className="mt-1.5 text-[0.65rem] italic text-[var(--color-text-muted)]">
                {service.port}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-center text-[0.7rem] text-[var(--color-text-muted)]">
          shared design tokens served by nginx at /shared/styles.css
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[0.75rem] text-[var(--color-text-muted)]">
        <span>push to main</span>
        <span className="text-[var(--color-border)]">&rarr;</span>
        <span>GitHub Actions</span>
        <span className="text-[var(--color-border)]">&rarr;</span>
        <span>SSH deploy</span>
        <span className="text-[var(--color-border)]">&rarr;</span>
        <span>docker compose up</span>
      </div>
    </div>
  );
}
