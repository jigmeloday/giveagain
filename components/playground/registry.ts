import type { ComponentType } from "react";
import { ButtonsDemo } from "./demos/buttons-demo";
import { ChoicesDemo } from "./demos/choices-demo";
import { ColorsDemo } from "./demos/colors-demo";
import { FormDemo } from "./demos/form-demo";
import { GridDemo } from "./demos/grid-demo";
import { InputsDemo } from "./demos/inputs-demo";
import { UploadDemo } from "./demos/upload-demo";
import { TypeDemo } from "./demos/type-demo";

export type Demo = {
  id: string;
  title: string;
  description: string;
  Component: ComponentType;
};

// Add a component here to get its own page at /playground/<id>.
export const DEMOS: Demo[] = [
  { id: "colors", title: "Colors", description: "Design tokens from globals.css.", Component: ColorsDemo },
  { id: "type", title: "Type", description: "Archivo scale and the mono label style.", Component: TypeDemo },
  { id: "buttons", title: "Buttons", description: "shadcn button variants, sizes and states.", Component: ButtonsDemo },
  { id: "grid", title: "Grid and cards", description: "Hard-line grid cells, never-words, item card sketch.", Component: GridDemo },
  { id: "inputs", title: "Text inputs", description: "Input, password, phone, textarea and search: default, hint, error, disabled.", Component: InputsDemo },
  { id: "choices", title: "Choices", description: "Select, combobox, radio group, checkbox and switch.", Component: ChoicesDemo },
  { id: "upload", title: "Image upload", description: "Photo picker with previews and limits.", Component: UploadDemo },
  { id: "form", title: "Full form", description: "All inputs wired with react-hook-form and Zod validation.", Component: FormDemo },
];

export function findDemo(id: string): Demo | undefined {
  return DEMOS.find((demo) => demo.id === id);
}
