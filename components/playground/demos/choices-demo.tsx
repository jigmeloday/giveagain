"use client";

import { useState } from "react";
import { DemoGroup } from "@/components/playground/demo-group";
import { Checkbox } from "@/components/shares/checkbox";
import { Combobox } from "@/components/shares/combobox";
import { RadioGroup } from "@/components/shares/radio-group";
import { Select } from "@/components/shares/select";
import { Switch } from "@/components/shares/switch";
import { CATEGORIES } from "@/constants/listing";
import { DZONGKHAGS } from "@/constants/location";
import { conditionOptions } from "@/constants/playground";
import { toOptions } from "@/lib/options";

const categories = toOptions(CATEGORIES);
const dzongkhags = toOptions(DZONGKHAGS);

export function ChoicesDemo() {
  const [dzongkhag, setDzongkhag] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <DemoGroup title="Select">
        <Select label="Category" options={categories} required />
        <Select label="Category" options={categories} error="Choose a category." />
        <Select label="Category" options={categories} defaultValue="Books" disabled />
      </DemoGroup>
      <DemoGroup title="Combobox (type to filter)">
        <div className="flex flex-col gap-2">
          <Combobox label="Dzongkhag" options={dzongkhags} value={dzongkhag} onValueChange={setDzongkhag} />
          <p className="font-mono text-[13px] text-muted-foreground">Value: {dzongkhag || "(none)"}</p>
        </div>
        <Combobox label="Dzongkhag" options={dzongkhags} error="Choose where the item can be collected." />
      </DemoGroup>
      <DemoGroup title="Radio group">
        <RadioGroup label="Condition" options={conditionOptions} defaultValue="Good" required />
        <RadioGroup label="Condition" options={conditionOptions} error="Choose the condition." />
      </DemoGroup>
      <DemoGroup title="Checkbox">
        <Checkbox label="I confirm this item is free to take." />
        <Checkbox label="I confirm this item is free to take." error="Please confirm the item is free to take." />
        <Checkbox label="Remind me by SMS" hint="Only about requests for your items." defaultChecked />
        <Checkbox label="Remind me by SMS" disabled />
      </DemoGroup>
      <DemoGroup title="Switch">
        <Switch label="Show my area on the listing" defaultChecked />
        <Switch label="Pause this listing" hint="Hidden until you turn it back on." />
        <Switch label="Pause this listing" disabled />
      </DemoGroup>
    </div>
  );
}
