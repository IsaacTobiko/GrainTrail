import Image from "next/image";

export default function AuthHero() {
  return (
    <section className="relative flex min-h-64 items-end overflow-hidden md:min-h-0">
      <Image
        src="/auth-hero.jpeg"
        alt="A hand holding a phone in a maize field at sunset"
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="absolute left-8 top-8 text-lg font-semibold">
        Grain
        <span className="text-lime">Trail</span>
      </div>
      <div className="relative p-8">
        <h2 className="text-2xl font-semibold leading-snug md:text-3xl">
          Follow your grain from the border to the buyer.
        </h2>
        <p className="mt-2 text-sm text-snow/80">
          Deals, quality, load trail and payments in one place.
        </p>
      </div>
    </section>
  );
}
