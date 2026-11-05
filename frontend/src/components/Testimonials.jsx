import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials, testimonialsIntro } from "../data/content";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeader from "./ui/SectionHeader";

const ease = [0.22, 1, 0.36, 1];

export default function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="scroll-mt-24 bg-soft py-14 sm:py-16 lg:py-20"
    >
      <Container>
        {/* ── Header slides from left ── */}
        <Reveal x={-50} y={0}>
          <SectionHeader
            eyebrow={testimonialsIntro.eyebrow}
            title={testimonialsIntro.title}
            titleId="testimonials-title"
          />
        </Reveal>

        {/* ── Cards — staggered bottom-up with whileHover ── */}
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} y={60} delay={index * 0.1} className="h-full">
              <motion.article
                className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card sm:p-6"
                whileHover={
                  reduce
                    ? undefined
                    : { y: -6, boxShadow: "0 24px 60px -28px rgba(20,22,26,0.28)" }
                }
                transition={{ duration: 0.25, ease }}
              >
                <Quote
                  size={24}
                  strokeWidth={1.6}
                  className="text-accent"
                  aria-hidden="true"
                />
                <blockquote className="mt-4 font-serif text-[17px] font-normal leading-[1.5] tracking-[-0.01em] text-ink sm:text-[18px]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <footer className="mt-auto flex items-center gap-3 border-t border-line pt-5">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-[10px] font-semibold tracking-[0.04em] text-white"
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink">{testimonial.name}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-muted">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </footer>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
