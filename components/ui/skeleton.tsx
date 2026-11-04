import { cn } from "@/lib/utils"

/** A grey block that stands in for content while it loads. Square and still for people who prefer reduced motion. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn("animate-pulse bg-mist motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
