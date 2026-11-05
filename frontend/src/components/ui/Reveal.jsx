import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/**
 * Reveal — scroll-triggered entrance animation.
 *
 * Props:
 *  y      — bottom-up offset (default 60). Set to 0 to disable vertical.
 *  x      — left/right offset (positive = from right, negative = from left). Default 0.
 *  delay  — stagger delay in seconds.
 *  once   — replay on re-enter? default true (animate once).
 *  scale  — initial scale factor (e.g. 0.96). Default undefined (no scale).
 *  as     — HTML tag to render. Default "div".
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 60,
  x = 0,
  scale,
  once = true,
  as = "div",
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  const initial = reduce
    ? false
    : { opacity: 0, y, x, ...(scale !== undefined ? { scale } : {}) };

  const animate = reduce
    ? undefined
    : { opacity: 1, y: 0, x: 0, ...(scale !== undefined ? { scale: 1 } : {}) };

  return (
    <MotionTag
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration: 0.65, delay, ease }}
    >
      {children}
    </MotionTag>
  );
}
