import Image from "next/image";

type PhotoMoment = {
  src: string;
  alt: string;
  caption: string;
  detail?: string;
  width: number;
  height: number;
};

export default function About() {
  const photoMoments: PhotoMoment[] = [
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
      src: "/media/about-photo-1.jpg",
      alt: "Cherry Blossoms downtown PDX",
      caption: "Portlandia did not age well as a show",
      width: 1024,
      height: 768,
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
    <div className="pt-12">
      <h1 className="page-title mb-8">About</h1>

      <section className="mb-12">
        <div className="mb-6 w-full max-w-[400px] overflow-hidden rounded-[var(--radius-lg)] border-2 border-[var(--color-border)]">
          <Image
            src="/media/profile-photo.jpeg"
            alt="Profile photo"
            width={800}
            height={420}
            sizes="(max-width: 480px) min(100vw - 3rem, 400px), 400px"
            quality={70}
            priority
            className="h-auto w-full"
          />
        </div>
      </section>

      <section className="mb-12 max-w-[680px]">
        <p className="text-[1.05rem] leading-[1.8] text-[var(--color-text-muted)]">
          I know that this is a bagel sandwich but I&apos;m truly a burger
          fanatic. Also love bikes, motorcycles, trains, music, and more.
        </p>
      </section>

      <section>
        <h2 className="mb-5 text-[1.4rem] font-bold tracking-[-0.02em]">
          Life Snapshots
        </h2>

        <div className="grid gap-5">
          {photoMoments.map((photo, index) => {
            const imageFirst = index % 2 === 0;

            return (
              <article
                key={photo.src}
                className="grid auto-rows-min grid-cols-1 items-stretch overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] min-[480px]:grid-cols-2"
              >
                {imageFirst && (
                  <div className="min-h-0 min-w-0 w-full self-start">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={80}
                      className="block h-auto w-full"
                    />
                  </div>
                )}

                <div className="flex min-h-0 min-w-0 flex-col justify-center p-4">
                  <p className="mb-2 font-semibold">{photo.caption}</p>
                  {photo.detail && (
                    <p className="text-[0.95rem] leading-relaxed text-[var(--color-text-muted)]">
                      {photo.detail}
                    </p>
                  )}
                </div>

                {!imageFirst && (
                  <div className="min-h-0 min-w-0 w-full self-start">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      quality={80}
                      className="block h-auto w-full"
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
