type ChoiceRowProps = {
  name: string;
  value: string;
  label: string;
  count?: number;
  checked: boolean;
};

/** A radio shown as a row: highlighted text and a count, with the radio itself hidden but keyboard-usable. */
export function ChoiceRow({ name, value, label, count, checked }: ChoiceRowProps) {
  return (
    <label className="relative flex cursor-pointer items-center justify-between gap-3 border-b border-line py-3 has-[:checked]:font-bold has-[:checked]:text-primary-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
      <input type="radio" name={name} value={value} defaultChecked={checked} className="sr-only" />
      <span>{label}</span>
      {count !== undefined && <span className="font-normal text-muted-foreground">{count}</span>}
    </label>
  );
}
