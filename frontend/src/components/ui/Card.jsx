import { cn } from "../../utils/cn";

export default function Card({ as: Tag = "div", className, children, ...props }) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-line bg-white p-6 shadow-card sm:p-8",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
