"use client";

import { DemoGroup } from "@/components/playground/demo-group";
import { useDemoForm } from "@/components/playground/use-demo-form";
import { Checkbox } from "@/components/shares/checkbox";
import { Combobox } from "@/components/shares/combobox";
import { FormField } from "@/components/shares/form-field";
import { ImageUpload } from "@/components/shares/image-upload";
import { Input } from "@/components/shares/input";
import { PhoneInput } from "@/components/shares/phone-input";
import { RadioGroup } from "@/components/shares/radio-group";
import { Select } from "@/components/shares/select";
import { Textarea } from "@/components/shares/textarea";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { conditionOptions } from "@/constants/playground";
import { toOptions } from "@/lib/options";

const categories = toOptions(CATEGORIES);
const dzongkhags = toOptions(DZONGKHAGS);

export function FormDemo() {
  const { form, onSubmit, sent, isSubmitting } = useDemoForm();
  const { control, register, formState: { errors } } = form;

  return (
    <DemoGroup title="Give something away (react-hook-form + Zod)">
      <form onSubmit={onSubmit} noValidate className="col-span-full flex max-w-xl flex-col gap-5">
        <Input label="Item name" placeholder="Wooden study desk" required error={errors.title?.message} {...register("title")} />
        <FormField control={control} name="category" render={({ field, error }) => (
          <Select label="Category" options={categories} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
        )} />
        <FormField control={control} name="dzongkhag" render={({ field, error }) => (
          <Combobox label="Dzongkhag" options={dzongkhags} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
        )} />
        <FormField control={control} name="condition" render={({ field, error }) => (
          <RadioGroup label="Condition" options={conditionOptions} required error={error} value={field.value ?? ""} onValueChange={field.onChange} />
        )} />
        <Textarea label="Description" required error={errors.description?.message} {...register("description")} />
        <FormField control={control} name="phone" render={({ field, error }) => (
          <PhoneInput label="Phone number" hint="Only the person you give to will see it." required error={error} value={field.value} onChange={field.onChange} />
        )} />
        <FormField control={control} name="photos" render={({ field, error }) => (
          <ImageUpload label="Photos" required error={error} files={field.value} onChange={field.onChange} />
        )} />
        <FormField control={control} name="agree" render={({ field, error }) => (
          <Checkbox label="I confirm this item is free to take." error={error} checked={field.value} onCheckedChange={field.onChange} />
        )} />
        <Button type="submit" size="lg" disabled={isSubmitting} className="self-start">
          {isSubmitting ? "Sending…" : "Give something away"}
        </Button>
        {sent && <pre className="overflow-x-auto bg-mist p-3 font-mono text-[12px]">{JSON.stringify(sent, null, 2)}</pre>}
      </form>
    </DemoGroup>
  );
}
