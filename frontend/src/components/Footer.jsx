import { footer } from "../data/content";
import Container from "./ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <Container className="flex flex-col gap-3 py-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{footer.copyright}</p>
        <a
          href="#about"
          className="inline-flex w-fit items-center font-medium text-secondary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
        >
          {footer.backToTop}
        </a>
      </Container>
    </footer>
  );
}
