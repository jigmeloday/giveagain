import { notFound } from "next/navigation";

// The playground is a development tool: it does not exist in production.
export default function PlaygroundLayout({ children }: LayoutProps<"/playground">) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
