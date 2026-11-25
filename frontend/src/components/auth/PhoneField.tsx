import { useState, useRef, useEffect } from "react";
import { inputClass } from "./styles";

const COUNTRIES = [
  { code: "KE", prefix: "+254", flag: "ke" },
  { code: "TZ", prefix: "+255", flag: "tz" },
];

const RULES: Record<string, { regex: RegExp; pattern: string; hint: string }> =
  {
    "+254": {
      regex: /^[17]\d{8}$/,
      pattern: "[17][0-9]{8}",
      hint: "Enter 9 digits starting with 7 or 1, for example 712345678",
    },
    "+255": {
      regex: /^[67]\d{8}$/,
      pattern: "[67][0-9]{8}",
      hint: "Enter 9 digits starting with 6 or 7, for example 712345678",
    },
  };

export default function PhoneField() {
  const [prefix, setPrefix] = useState("+254");
  const [digits, setDigits] = useState("");
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const current = COUNTRIES.find((c) => c.prefix === prefix) ?? COUNTRIES[0];
  const rule = RULES[prefix];
  const valid = rule.regex.test(digits);
  const showError = touched && !valid;

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div>
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
          value={digits}
          onChange={(e) =>
            setDigits(
              e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 9),
            )
          }
          onBlur={() => setTouched(true)}
          onInvalid={(e) => {
            e.preventDefault();
            setTouched(true);
          }}
          pattern={rule.pattern}
          aria-invalid={showError}
          placeholder="712345678"
          className={`${inputClass} ${
            showError
              ? "border-danger! focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]!"
              : valid
                ? "border-leaf!"
                : ""
          }`}
        />
      </div>

      <div className="mt-2 flex items-start justify-between gap-3 text-xs">
        {showError ? (
          <p
            role="alert"
            className="anim-fade-up flex items-center gap-1.5 rounded-md border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-danger"
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            {rule.hint}
          </p>
        ) : (
          <span />
        )}
        <span
          className={`shrink-0 pt-1 tabular-nums transition-colors ${valid ? "text-emerald" : "text-muted"}`}
        >
          {digits.length}/9
        </span>
      </div>
    </div>
  );
}
