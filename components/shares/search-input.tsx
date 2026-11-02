import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input as InputPrimitive } from "@/components/ui/input";

type SearchInputProps = {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  onSearch: (query: string) => void;
};

/** Search field with the button attached. `label` is read by screen readers only. */
export function SearchInput({ label = "Search", placeholder = "Search free things", defaultValue, className, onSearch }: SearchInputProps) {
  return (
    <form role="search" action={(data) => onSearch(String(data.get("q") ?? "").trim())} className={className}>
      <div className="flex">
        <InputPrimitive
          name="q"
          type="search"
          aria-label={label}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="border-foreground"
        />
        <Button type="submit" size="lg" className="shrink-0 border-foreground">
          <Search aria-hidden />
          Search
        </Button>
      </div>
    </form>
  );
}
