import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navCta, navLinks, site } from "../data/content";
import { cn } from "../utils/cn";
import Button from "./ui/Button";
import Container from "./ui/Container";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("about");

  useEffect(() => {
    const ids = [...navLinks.map((link) => link.href.slice(1)), "contact"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.15, 0.4, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const closeOnDesktop = window.matchMedia("(min-width: 768px)");
    const handleResize = (event) => {
      if (event.matches) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    closeOnDesktop.addEventListener("change", handleResize);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      closeOnDesktop.removeEventListener("change", handleResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/[0.92] backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
        <a
          href="#about"
          className="flex shrink-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
          aria-label={`${site.name} — home`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-ink text-xs font-semibold tracking-[0.04em] text-white">
            {site.initials}
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {site.name}
          </span>
        </a>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeId === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group relative inline-flex py-2 text-sm font-medium transition-colors hover:text-accent",
                      isActive ? "text-ink" : "text-secondary"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-[1.5px] bg-accent transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      )}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            href={navCta.href}
            className="hidden h-10 min-h-10 px-4 sm:inline-flex"
          >
            {navCta.label}
          </Button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-line bg-white shadow-card md:hidden"
          >
            <Container className="py-4">
              <nav aria-label="Mobile navigation">
                <ul className="divide-y divide-line">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between py-4 text-base font-medium text-secondary transition-colors hover:text-accent"
                      >
                        {link.label}
                        <span className="text-muted" aria-hidden="true">
                          →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button
                href={navCta.href}
                onClick={() => setOpen(false)}
                className="mt-4 w-full"
              >
                {navCta.label}
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
