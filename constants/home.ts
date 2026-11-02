export const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Sign in", href: "/sign-in" },
] as const;

export const STEPS = [
  { title: "Post it", body: "Add a photo and a few words about the thing you no longer need." },
  { title: "Someone asks", body: "People nearby ask for it and leave a phone number." },
  { title: "Hand it over", body: "Pick who gets it, arrange pickup, and mark it given." },
] as const;

export const NOT_FOR_SALE = ["Prices", "Bidding", "Selling", "Delivery fees"] as const;

export const FOOTER_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Give something", href: "/give" },
  { label: "Sign in", href: "/sign-in" },
] as const;
