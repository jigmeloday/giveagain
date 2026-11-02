export type PasswordStrength = { score: 0 | 1 | 2 | 3 | 4; label: string };

/** A simple, friendly strength hint. The real rule is the 8-character minimum in the schema. */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" };
  if (password.length < 8) return { score: 1, label: "Keep going: use at least 8 characters." };
  let score = 2;
  if (password.length >= 12) score++;
  if (/\d/.test(password) && /\p{L}/u.test(password)) score++;
  if (score === 2) return { score, label: "Getting there: add a number or make it longer." };
  return score === 3 ? { score, label: "Good." } : { score: 4, label: "Strong." };
}
