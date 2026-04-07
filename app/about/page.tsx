import Image from "next/image";

export default function About() {
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
    </div>
  );
}
