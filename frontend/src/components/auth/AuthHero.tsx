import Image from "next/image";

export default function AuthHero() {
  return (
    <section className="relative flex min-h-72 items-end overflow-hidden sm:min-h-80 md:min-h-0">
      <Image
        src="/auth-hero.jpeg"
        alt="A hand holding a phone in a maize field at sunset"
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="anim-zoom object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="anim-fade-in absolute left-5 top-5 font-display text-2xl font-extrabold tracking-tight text-snow [--delay:200ms] sm:left-8 sm:top-8 sm:text-3xl">
        Grain
        <span className="text-lime">Trail</span>
      </div>
      <div className="relative p-5 sm:p-8 lg:p-12">
        <h2 className="anim-fade-up font-display text-3xl font-bold leading-tight tracking-tight text-snow [--delay:400ms] sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
          Follow your grain from the border to the buyer.
        </h2>
        <p className="anim-fade-up mt-3 max-w-xl text-base text-snow/85 [--delay:700ms] sm:mt-4 sm:text-lg lg:text-xl">
          Deals, quality, load trail and payments in one place.
        </p>
      </div>
    </section>
  );
}
