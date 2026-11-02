import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { formatPhone } from "@/lib/phone-format";

/** Big tap-to-call button that also shows the number. */
export function CallButton({ name, phone }: { name: string; phone: string }) {
  return (
    <a href={`tel:${phone}`} className={buttonVariants({ size: "lg", variant: "outline", className: "w-fit" })}>
      <Phone aria-hidden />
      Call {name}: {formatPhone(phone)}
    </a>
  );
}
