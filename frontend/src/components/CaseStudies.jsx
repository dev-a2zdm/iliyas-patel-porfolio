import { motion, useReducedMotion } from "framer-motion";
import { projects } from "../data/content";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1];

export default function CaseStudies() {
  const reduce = useReducedMotion();

  return (
    <section
      id="cases"
      aria-labelledby="projects-title"
      className="relative scroll-mt-24 bg-paper py-14 sm:py-16 lg:py-20"
    >
      <div id="projects" className="absolute -top-24" aria-hidden="true" />
      <Container>

        {/* ── Section header: title from left, description from right ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal x={-50} y={0}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-eyebrow text-muted">
                Project archive
              </p>
              <h2
                id="projects-title"
                className="mt-3 font-serif text-[clamp(2rem,4.3vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink"
              >
                {projects.title}
              </h2>
            </div>
          </Reveal>
          <Reveal x={50} y={0} delay={0.08} className="sm:max-w-md sm:text-right">
            <p className="text-sm leading-relaxed text-muted">
              {projects.description}
            </p>
          </Reveal>
        </div>

        {/* ── Project cards — staggered bottom-up ── */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {projects.items.map((project, index) => (
            <Reveal key={project.name} y={60} delay={index * 0.07} className="h-full">
              <motion.article
                className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card"
                whileHover={
                  reduce
                    ? undefined
                    : {
                        y: -6,
                        borderColor: "#D4D7DB",
                        boxShadow: "0 24px 60px -28px rgba(20,22,26,0.28)",
                      }
                }
                transition={{ duration: 0.28, ease }}
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-line bg-soft">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <h3 className="font-serif text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent sm:text-[18px]">
                    {project.name}
                  </h3>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
