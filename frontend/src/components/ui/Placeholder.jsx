import { cn } from "../../utils/cn";

export default function Placeholder({
  imageSrc,
  alt = "",
  label = "Image",
  className,
  imageClassName,
  loading = "lazy",
  fetchPriority,
}) {
  if (imageSrc) {
    return (
      <div className={cn("overflow-hidden", className)}>
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "placeholder-stripes flex items-center justify-center rounded-3xl border border-dashed border-[#C9CDD2]",
        className
      )}
      role="img"
      aria-label={label}
    >
      <span className="rounded-full bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-eyebrow text-muted">
        {label}
      </span>
    </div>
  );
}
