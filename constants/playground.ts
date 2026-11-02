export const VIEWPORTS = [
  { id: "phone", label: "Phone", width: 360 },
  { id: "tablet", label: "Tablet", width: 768 },
  { id: "full", label: "Full", width: null },
] as const;

export type ViewportId = (typeof VIEWPORTS)[number]["id"];

export const COLOR_TOKENS = [
  { name: "background", className: "bg-background border", note: "Page" },
  { name: "mist", className: "bg-mist", note: "Panels, photo placeholders" },
  { name: "line", className: "bg-line", note: "Grid lines, dividers" },
  { name: "foreground", className: "bg-foreground", note: "Ink: text, dark panels" },
  { name: "muted-foreground", className: "bg-muted-foreground", note: "Meta text" },
  { name: "primary", className: "bg-primary", note: "Fills with white text" },
  { name: "primary-dark", className: "bg-primary-dark", note: "Hover, small orange text" },
  { name: "destructive", className: "bg-destructive", note: "Errors only" },
] as const;

export const TYPE_SCALE = [
  { label: "Hero · 800 · -0.04em", className: "text-[clamp(44px,8vw,88px)] leading-[0.92] font-extrabold tracking-[-0.045em]" },
  { label: "Section · 800", className: "text-3xl font-extrabold tracking-[-0.04em]" },
  { label: "Card title · 700", className: "text-[15px] font-bold" },
  { label: "Body · 400", className: "text-base" },
  { label: "Label · mono, caps", className: "font-mono text-[11px] uppercase tracking-[0.08em] text-primary-ink" },
] as const;

export const NEVER_WORDS = ["Prices", "Bidding", "Selling", "Delivery fees"] as const;

export const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

export const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;

export const conditionOptions = [
  { value: "Like new", label: "Like new", hint: "Hardly used, no marks." },
  { value: "Good", label: "Good", hint: "Works well, small signs of use." },
  { value: "Fair", label: "Fair", hint: "Works, with visible wear." },
];
