import { inputClass } from "./styles";

export default function PhoneField() {
  return (
    <div className="flex gap-2">
      <select
        name="prefix"
        defaultValue="+254"
        className={`${inputClass} w-32! shrink-0 px-3! text-center`}
      >
        <option value="+254">KE +254</option>
        <option value="+255">TZ +255</option>
      </select>
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
