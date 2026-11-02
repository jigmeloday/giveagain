import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { GiveListingOutput } from "@/schemas/listing";

export type StepProps = {
  control: Control<GiveListingOutput>;
  register: UseFormRegister<GiveListingOutput>;
  errors: FieldErrors<GiveListingOutput>;
};
