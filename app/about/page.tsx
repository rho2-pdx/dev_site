import Image from "next/image";

type PhotoMoment = {
  src: string;
  alt: string;
  caption: string;
  detail?: string;
  /** Intrinsic pixel size of the file (for layout + `next/image`). */
  width: number;
  height: number;
};

export default function About() {
  const photoMoments: PhotoMoment[] = [
    {
      src: "/media/about-photo-1.jpg",
      alt: "Cherry Blossoms downtown PDX",
      caption: "Portlandia did not age well as a show",
      width: 1024,
      height: 768,
    },
    {
      src: "/media/about-photo-2.jpg",
      alt: "white collar child labor",
      caption:
        "here I am writing git before Linus did but i forgot to save and lost it all after a crash",
      width: 1024,
      height: 710,
    },
    {
      src: "/media/about-photo-3.jpg",
      alt: "cookie monster",
      caption:
        "Fun Fact: Lebron James left the Heat because Pat Riley took away his cookies",
      width: 768,
      height: 1024,
    },
    {
      src: "/media/about-photo-4.jpg",
      alt: "100% UV blocking sunglasses",
      caption: "Safety first!",
      width: 682,
      height: 1024,
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
          fanatic. Also love bikes, motorcycles, trains, music, and more.
        </p>
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

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {photoMoments.map((photo, index) => {
            const imageFirst = index % 2 === 0;

            return (
              <article
                key={photo.src}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  alignItems: "stretch",
                  gridAutoRows: "minmax(0, auto)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  background: "var(--color-surface)",
                }}
              >
                {imageFirst && (
                  <div
                    style={{
                      minWidth: 0,
                      minHeight: 0,
                      width: "100%",
                      alignSelf: "start",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={80}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    minWidth: 0,
                    minHeight: 0,
                    padding: "1.1rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p style={{ marginBottom: "0.45rem", fontWeight: 600 }}>
                    {photo.caption}
                  </p>
                  {photo.detail && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {photo.detail}
                    </p>
                  )}
                </div>

                {!imageFirst && (
                  <div
                    style={{
                      minWidth: 0,
                      minHeight: 0,
                      width: "100%",
                      alignSelf: "start",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={80}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
