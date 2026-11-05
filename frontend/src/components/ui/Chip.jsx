import { cn } from "../../utils/cn";

export default function Chip({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center break-words rounded-full bg-chip px-3 py-1.5 text-xs font-medium leading-snug text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
