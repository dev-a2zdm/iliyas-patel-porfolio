import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { hero, stats } from "../data/content";
import { cn } from "../utils/cn";
import Button from "./ui/Button";
import Container from "./ui/Container";
import Placeholder from "./ui/Placeholder";

const ease = [0.22, 1, 0.36, 1];

/* ── Hero text stagger ─────────────────────────────── */
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.78, ease } },
};

/* ── Subtle floating keyframe for decorative blobs ── */
const float = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

export default function Hero({ imageSrc }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 28]);

  return (
    <section
      id="about"
      aria-labelledby="hero-title"
      className="relative scroll-mt-24 overflow-hidden"
    >
      {/* ── Radial accent glow ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(ellipse_at_78%_8%,rgba(217,71,42,0.07),transparent_52%)]"
        aria-hidden="true"
      />

      {/* ── Floating decorative ring — top-left ── */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute -left-20 top-28 h-56 w-56 rounded-full border border-accent/10 sm:-left-10 sm:top-20 sm:h-72 sm:w-72"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.6 }}
        />
      )}

      {/* ── Floating dot cluster — bottom-right background ── */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute bottom-24 right-4 grid grid-cols-4 gap-2 opacity-0 sm:right-12"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-accent"
              style={{ opacity: (i % 4) * 0.2 + 0.2 }}
            />
          ))}
        </motion.div>
      )}

      <Container className="relative pb-10 pt-8 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] lg:gap-16">

          {/* ── Left: text block — stagger children from bottom ── */}
          <motion.div
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="show"
          >
            <motion.p
              variants={item}
              className="mb-5 text-xs font-semibold uppercase tracking-eyebrow text-muted"
            >
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              variants={item}
              id="hero-title"
              className="max-w-[760px] text-balance font-serif text-[clamp(2.75rem,6.7vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink"
            >
              {hero.title}
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-7 max-w-[590px] text-[15px] leading-[1.75] text-secondary sm:text-base"
            >
              {hero.intro}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button href={hero.primaryCta.href} className="group">
                {hero.primaryCta.label}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>
              <Button href={hero.secondaryCta.href} variant="outline" className="group">
                {hero.secondaryCta.label}
                <ArrowDown
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right: profile image — slides from right + parallax ── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 48, scale: 0.97 }}
            animate={reduce ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.95, delay: 0.25, ease }}
            style={{ y: imageY }}
            className="mx-auto w-full max-w-[390px] lg:mx-0 lg:ml-auto lg:max-w-none"
          >
            <div className="relative">
              {/* decorative corner bracket */}
              <div
                className="absolute -right-3 -top-3 h-20 w-20 rounded-tr-[28px] border-r border-t border-accent/35"
                aria-hidden="true"
              />

              {/* floating glow blob behind image */}
              {!reduce && (
                <motion.div
                  className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-accent/5 blur-2xl"
                  aria-hidden="true"
                  {...float(1.2)}
                />
              )}

              <Placeholder
                imageSrc={imageSrc || hero.image.src}
                alt={hero.image.alt}
                label={hero.image.label}
                loading="eager"
                fetchPriority="high"
                className="aspect-[4/5] rounded-[28px] border border-line bg-soft shadow-card"
                imageClassName="object-[center_22%]"
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-2xl border border-white/50 bg-white/[0.92] px-4 py-3 text-xs font-medium text-secondary shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {hero.imageBadge}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats bar — staggered bottom-up ── */}
        <div className="mt-10 grid grid-cols-2 border-y border-line sm:mt-12 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.value}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease }}
              className={cn(
                "px-4 py-6 sm:px-6 md:px-7 md:py-8",
                index % 2 === 1 && "border-l border-line",
                index > 0 && "md:border-l md:border-line",
                index >= 2 && "border-t border-line md:border-t-0"
              )}
            >
              <div className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none tracking-[-0.03em] text-ink">
                {stat.value}
              </div>
              <p className="mt-3 max-w-[200px] text-[13px] leading-[1.45] text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
