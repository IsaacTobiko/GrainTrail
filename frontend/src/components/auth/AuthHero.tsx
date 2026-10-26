export default function AuthHero() {
  return (
    <section className="relative flex min-h-52 items-end overflow-hidden bg-gradient-to-b from-[#1a3a24] via-[#0f2a1a] to-ink p-8 md:min-h-[640px]">
      <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald/30 blur-3xl" />
      <div className="absolute left-8 top-8 text-lg font-semibold">
        Grain
        <span className="text-lime">Trail</span>
      </div>
      <div className="relative">
        <h2 className="text-2xl font-semibold leading-snug md:text-3xl">
          Follow your grain from the border to the buyer.
        </h2>
        <p className="mt-2 text-sm text-muted">
          Deals, quality, load trail and payments in one place.
        </p>
      </div>
    </section>
  );
}
