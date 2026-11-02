"use client";

import { useState } from "react";
import { DemoGroup } from "@/components/playground/demo-group";
import { Input } from "@/components/shares/input";
import { PasswordInput } from "@/components/shares/password-input";
import { PhoneInput } from "@/components/shares/phone-input";
import { SearchInput } from "@/components/shares/search-input";
import { Textarea } from "@/components/shares/textarea";

export function InputsDemo() {
  const [phone, setPhone] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col gap-8">
      <DemoGroup title="Text input">
        <Input label="Item name" placeholder="Wooden study desk" />
        <Input label="Item name" hint="A short, plain name works best." placeholder="Wooden study desk" required />
        <Input label="Item name" error="Give the item a short name." defaultValue="a" />
        <Input label="Item name" disabled defaultValue="Wooden study desk" />
        <Input label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
      </DemoGroup>
      <DemoGroup title="Password">
        <PasswordInput label="Password" hint="At least 8 characters." autoComplete="new-password" />
        <PasswordInput label="Password" error="That password is too short." defaultValue="abc" />
      </DemoGroup>
      <DemoGroup title="Phone (+975)">
        <PhoneInput label="Phone number" hint="Only the person you give to will see it." value={phone} onChange={setPhone} />
        <PhoneInput label="Phone number" error="Enter a valid phone number, like 17 12 34 56." value="+97512" />
        <p className="font-mono text-[13px] text-muted-foreground">Form value: {phone || "(empty)"}</p>
      </DemoGroup>
      <DemoGroup title="Textarea">
        <Textarea label="Description" hint="Size, colour, anything that is worn or missing." />
        <Textarea label="Description" error="Tell people a little more." defaultValue="Desk" />
      </DemoGroup>
      <DemoGroup title="Search">
        <div className="flex flex-col gap-2">
          <SearchInput onSearch={setQuery} />
          <p className="font-mono text-[13px] text-muted-foreground">Last search: {query || "(none)"}</p>
        </div>
      </DemoGroup>
    </div>
  );
}
