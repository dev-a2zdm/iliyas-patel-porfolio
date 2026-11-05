import { MotionConfig } from "framer-motion";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CaseStudies from "./components/CaseStudies";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { skipLink } from "./data/content";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        {skipLink}
      </a>
      <div className="min-h-screen overflow-x-clip bg-paper">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Services />
          <CaseStudies />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
