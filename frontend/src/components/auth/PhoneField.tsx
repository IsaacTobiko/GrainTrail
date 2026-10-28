import { useState, useRef, useEffect } from "react";
import { inputClass } from "./styles";

const COUNTRIES = [
  { code: "KE", prefix: "+254", flag: "ke" },
  { code: "TZ", prefix: "+255", flag: "tz" },
];

export default function PhoneField() {
  const [prefix, setPrefix] = useState("+254");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const current = COUNTRIES.find((c) => c.prefix === prefix) ?? COUNTRIES[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="flex gap-2">
      <div ref={boxRef} className="relative w-36 shrink-0">
        <input type="hidden" name="prefix" value={prefix} />

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`${inputClass} flex w-full! items-center gap-2 px-3!`}
        >
          <img
            src={`https://flagcdn.com/w40/${current.flag}.png`}
            alt={current.code}
            className="h-4 w-6 rounded-sm object-cover"
          />
          <span>{current.prefix}</span>
          <span className="ml-auto text-xs">▾</span>
        </button>

        {open && (
          <ul
            role="listbox"
            className="absolute z-10 mt-1 w-full rounded-md border border-emerald-400/30 bg-emerald-950 text-white shadow-lg"
          >
            {COUNTRIES.map((c) => (
              <li
                key={c.code}
                role="option"
                aria-selected={c.prefix === prefix}
                onClick={() => {
                  setPrefix(c.prefix);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-emerald-400/15"
              >
                <img
                  src={`https://flagcdn.com/w40/${c.flag}.png`}
                  alt={c.code}
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span>
                  {c.code} {c.prefix}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        name="phone"
        type="tel"
        inputMode="numeric"
        required
        placeholder="712 345 678"
        className={inputClass}
      />
    </div>
  );
}
