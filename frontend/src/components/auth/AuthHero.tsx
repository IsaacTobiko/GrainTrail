import Image from "next/image";

export default function AuthHero() {
  return (
    <section className="relative hidden items-end overflow-hidden md:flex">
      <Image
        src="/auth-hero.jpeg"
        alt="A hand holding a phone in a maize field at sunset"
        fill
        priority
        sizes="50vw"
        className="anim-zoom object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="anim-fade-in absolute left-8 top-8 font-display text-3xl font-extrabold tracking-tight text-snow [--delay:200ms]">
        Grain
        <span className="text-lime">Trail</span>
      </div>
      <div className="relative p-8 lg:p-12">
        <h2 className="anim-fade-up font-display text-3xl font-bold leading-tight tracking-tight text-snow [--delay:400ms] lg:text-4xl xl:text-5xl 2xl:text-6xl">
          Follow your grain from the border to the buyer.
        </h2>
        <p className="anim-fade-up mt-4 max-w-xl text-lg text-snow/85 [--delay:700ms] lg:text-xl">
          Deals, quality, load trail and payments in one place.
        </p>
      </div>
    </section>
  );
}
