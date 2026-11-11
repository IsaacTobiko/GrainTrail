export function normalizePhone(prefix: string, raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  return `${prefix}${digits}`;
}
