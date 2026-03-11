import Image from "next/image";

export default function About() {
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
        About
      </h1>

      {/* Profile Photo */}
      <section style={{ marginBottom: "3rem" }}>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--color-border)",
            marginBottom: "1.5rem",
          }}
        >
          <Image
            src="/media/profile-photo.jpeg"
            alt="Profile photo"
            width={1200}
            height={630}
            quality={66}
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
            marginBottom: "1.25rem",
          }}
        >
          I know that this is a bagel sandwich but I'm truly a burger fanatic
        </p>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--color-text-muted)",
            lineHeight: 1.8,
          }}
        ></p>
      </section>
    </div>
  );
}
