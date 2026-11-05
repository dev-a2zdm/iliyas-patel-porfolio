import { cn } from "../../utils/cn";

const styles = {
  primary:
    "border border-ink bg-ink text-white hover:border-accent hover:bg-accent",
  outline:
    "border-[1.5px] border-ink bg-transparent text-ink hover:border-accent hover:text-accent",
};

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}) {
  const Tag = href ? "a" : "button";
  const tagProps = href ? { href } : { type };

  return (
    <Tag
      {...tagProps}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
