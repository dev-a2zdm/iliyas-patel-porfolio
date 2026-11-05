import { cn } from "../../utils/cn";

export default function Container({ as: Tag = "div", className, children }) {
  return (
    <Tag className={cn("mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
