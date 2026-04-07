import Image from "next/image";

export default function About() {
  const photoMoments = [
    {
      src: "/media/about-photo-1.jpg",
      alt: "Placeholder memory 1",
      caption: "Placeholder caption about this moment.",
      detail: "Add where this was, who was there, and why it mattered.",
    },
    {
      src: "/media/about-photo-2.jpg",
      alt: "Placeholder memory 2",
      caption: "Placeholder caption for this throwback.",
      detail: "Swap in a quick story that adds personality.",
    },
    {
      src: "/media/about-photo-3.jpg",
      alt: "Placeholder memory 3",
      caption: "Placeholder caption for this fun memory.",
      detail: "Add one sentence about what made this day memorable.",
    },
    {
      src: "/media/about-photo-4.jpg",
      alt: "Placeholder memory 4",
      caption: "Placeholder caption for this adventure.",
      detail: "Mention what you learned, loved, or laughed about here.",
    },
  ];

  return (
    <div style={{ paddingTop: "3rem" }}>
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

      {/* Profile Photo */}
      <section style={{ marginBottom: "3rem" }}>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "2px solid var(--color-border)",
            marginBottom: "1.5rem",
          }}
        >
          <Image
            src="/media/profile-photo.jpeg"
            alt="Profile photo"
            /* Display cap ~400px; 800×420 keeps 1200:630 aspect ratio and covers 2× retina. */
            width={800}
            height={420}
            sizes="(max-width: 480px) min(100vw - 3rem, 400px), 400px"
            quality={70}
            priority
          />
        </div>
      </section>

      {/* Bio */}
      <section style={{ marginBottom: "3rem", maxWidth: "680px" }}>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
          }}
        >
          I know that this is a bagel sandwich but I&apos;m truly a burger
          fanatic
        </p>
      </section>

      {/* Extra Details */}
      <section style={{ marginBottom: "3rem", maxWidth: "680px" }}>
        <h2
          style={{
            fontSize: "1.4rem",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          A Few More Things
        </h2>
        <ul
          style={{
            paddingLeft: "1.2rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
          }}
        >
          <li>Placeholder detail about what you&apos;re currently building.</li>
          <li>Placeholder detail about hobbies outside of tech.</li>
          <li>Placeholder detail about values and what drives you.</li>
          <li>
            Placeholder detail about future goals or projects you&apos;re excited
            about.
          </li>
        </ul>
      </section>

      {/* Photo Moments */}
      <section>
        <h2
          style={{
            fontSize: "1.4rem",
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em",
          }}
        >
          Life Snapshots
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {photoMoments.map((photo) => (
            <article
              key={photo.src}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                background: "var(--color-surface)",
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={900}
                height={700}
                sizes="(max-width: 768px) 100vw, 25vw"
                quality={80}
              />
              <div style={{ padding: "0.9rem" }}>
                <p style={{ marginBottom: "0.45rem", fontWeight: 600 }}>
                  {photo.caption}
                </p>
                <p
                  style={{
                    color: "var(--color-text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {photo.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
