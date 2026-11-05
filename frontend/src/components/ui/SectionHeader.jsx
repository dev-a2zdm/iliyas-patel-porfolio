import { cn } from "../../utils/cn";

export default function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  align = "left",
  className,
  titleClassName,
  descriptionClassName,
}) {
  const isSplit = Boolean(description);

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        isSplit && "lg:flex-row lg:items-end lg:justify-between lg:gap-14",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn(isSplit && "max-w-3xl")}>
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-eyebrow text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={titleId}
          className={cn(
            "font-serif text-[clamp(2rem,4.3vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink",
            titleClassName
          )}
        >
          {title}
        </h2>
      </div>
      {description ? (
        <p
          className={cn(
            "max-w-sm text-sm leading-relaxed text-muted lg:text-right",
            descriptionClassName
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
