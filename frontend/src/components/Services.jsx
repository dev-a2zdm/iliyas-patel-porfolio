import { motion, useReducedMotion } from "framer-motion";
import {
  ChartNoAxesCombined,
  Layers2,
  Search,
} from "lucide-react";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";

const ease = [0.22, 1, 0.36, 1];

const cardsData = [
  {
    number: "01",
    title: "Technical SEO",
    subtitle: "17 SERVICES",
    icon: Search,
    tags: [
      "Technical SEO",
      "JavaScript SEO",
      "Rendering SEO",
      "Crawl Budget Optimization",
      "Core Web Vitals",
      "Angular SEO",
      "Website Architecture",
      "On-Page SEO",
      "Internal Linking",
      "E-E-A-T SEO",
      "Structured Data",
      "Organic Traffic Drop",
      "Google Search Console Audit",
      "Core Update Analysis",
      "Traffic Loss",
      "Google Penalty",
      "Link Audit",
    ],
  },
  {
    number: "02",
    title: "Digital Analytics",
    subtitle: "PLATFORMS & TECHNOLOGIES",
    icon: ChartNoAxesCombined,
    tags: [
      "Google Analytics 4 (GA4)",
      "Universal Analytics (UA)",
      "Google Tag Manager (GTM)",
      "Server-Side GTM",
      "Google Data Studio (GDS) with Custom Connectors",
      "Firebase",
      "Google BigQuery (GBQ)",
      "Google Cloud Platform",
      "Measurement Protocol",
      "Meta Conversion API (CAPI)",
      "Meta Pixel (Facebook Pixel)",
      "Google Marketing Platform 360",
      "Google Ads",
      "Meta Ads (Facebook Ads)",
    ],
  },
  {
    number: "03",
    title: "Product Technologies",
    subtitle: "12 TECHNOLOGIES",
    icon: Layers2,
    tags: [
      "Shopify",
      "WordPress",
      "WooCommerce",
      "Magento",
      "Drupal",
      "iOS Apps",
      "Android Apps",
      "React",
      "Laravel",
      "GoHighLevel",
      "Angular",
      "Other Technologies",
    ],
  },
];

export default function Services() {
  const reduce = useReducedMotion();

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="scroll-mt-24 bg-soft py-14 sm:py-16 lg:py-20"
    >
      <Container>
        {/* ── Section header slides in from left ── */}
        <Reveal x={-50} y={0}>
          <div className="max-w-4xl text-left">
            <p className="mb-3 text-xs font-semibold uppercase tracking-eyebrow text-muted">
              What I do &amp; how I do it
            </p>
            <h2
              id="services-title"
              className="font-serif text-[clamp(2rem,4.3vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink"
            >
              The full stack behind visible search and trusted data.
            </h2>
          </div>
        </Reveal>

        {/* ── Cards — staggered bottom-up ── */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:gap-5 lg:gap-6">
          {cardsData.map((card, index) => {
            const Icon = card.icon;

            return (
              <Reveal key={card.title} y={60} delay={index * 0.1}>
                <motion.article
                  className="group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-card sm:rounded-[24px] lg:flex-row"
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -4, boxShadow: "0 24px 60px -28px rgba(20,22,26,0.28)" }
                  }
                  transition={{ duration: 0.25, ease }}
                >
                  {/* ── Left Panel ── */}
                  <div className="flex min-w-0 shrink-0 flex-col justify-between gap-5 border-b border-line bg-soft/50 p-6 sm:p-7 lg:w-64 lg:border-b-0 lg:border-r lg:p-8 xl:w-72">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-chip text-ink transition-colors duration-300 group-hover:bg-tag group-hover:text-accent-strong">
                        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span
                        className="font-serif text-sm font-medium text-muted"
                        aria-hidden="true"
                      >
                        {card.number}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-[22px] font-medium leading-snug tracking-[-0.025em] text-ink sm:text-[24px]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-eyebrow text-muted">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* ── Right Panel: tags ── */}
                  <div className="flex min-w-0 flex-1 flex-wrap content-center gap-2 p-6 sm:p-7 lg:p-8">
                    {card.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-chip px-3.5 py-1.5 text-[12.5px] font-medium leading-normal text-secondary cursor-default"
                        whileHover={
                          reduce
                            ? undefined
                            : { backgroundColor: "#ffffff", boxShadow: "0 1px 6px rgba(0,0,0,0.08)", scale: 1.03 }
                        }
                        transition={{ duration: 0.18 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
