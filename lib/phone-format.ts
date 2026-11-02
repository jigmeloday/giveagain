export const BHUTAN_DIAL_CODE = "+975";

/** Digits the person typed, without the country code or any separators. */
export function nationalDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return value.trim().startsWith("+975") || digits.startsWith("975") ? digits.slice(3) : digits;
}

/** The form value: country code plus digits, or "" when nothing is typed. */
export function withDialCode(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  return clean ? `${BHUTAN_DIAL_CODE}${clean}` : "";
}

/** Show 8 digits as "17 12 34 56". */
export function groupDigits(digits: string): string {
  return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}
