import type { UserSettings } from "@/types/account";

type ToggleDef<G extends keyof UserSettings> = { group: G; key: keyof UserSettings[G] & string; label: string; hint: string };

export const NOTIFY_TOGGLES: ToggleDef<"notify">[] = [
  { group: "notify", key: "requests", label: "Someone asks for my things", hint: "So you can choose who it goes to" },
  { group: "notify", key: "answers", label: "A giver answers my request", hint: "Accepted or declined, so you know what to do next" },
  { group: "notify", key: "nearby", label: "Something new is posted near me", hint: "Based on the Dzongkhag where you live" },
  { group: "notify", key: "weekly", label: "Weekly round-up", hint: "A short email of what was given away near you" },
];

export const PRIVACY_TOGGLES: ToggleDef<"privacy">[] = [
  { group: "privacy", key: "firstNameOnly", label: "Show only my first name and initial", hint: "Turn off to show your full name on your posts" },
  { group: "privacy", key: "showGiven", label: "Show how many things I've given", hint: "Shown on your giver card, to help neighbours trust you" },
];
