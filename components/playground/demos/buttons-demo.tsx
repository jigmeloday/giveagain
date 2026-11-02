import { Button } from "@/components/ui/button";
import { BUTTON_SIZES, BUTTON_VARIANTS } from "@/constants/playground";

export function ButtonsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {BUTTON_SIZES.map((size) => (
          <Button key={size} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>Disabled</Button>
        <Button aria-invalid>Invalid</Button>
      </div>
    </div>
  );
}
