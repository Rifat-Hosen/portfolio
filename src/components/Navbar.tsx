"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";

const navLinks = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Education", id: "education" },
  { label: "Skills", id: "skills" },
  { label: "Activities", id: "activities" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position to increase background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Observe sections for active link detection
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/20"
          : "bg-slate-900/70 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-1 group"
          >
            <span className="text-xl font-bold text-white tracking-tight">
              Rifat Hosen
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="relative py-1 text-sm font-medium transition-colors duration-200 hover:text-emerald-400"
                style={{
                  color: activeSection === link.id ? "#34d399" : "#cbd5e1",
                }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.span
                    layoutId="activeUnderline"
                    className="absolute left-0 -bottom-1 h-0.5 w-full bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}

            {/* Resume button */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-emerald-400 border border-emerald-400/50 rounded-lg hover:bg-emerald-400/10 transition-colors duration-200"
            >
              <Download size={14} />
              Resume
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.25 }}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-slate-800/60"
                  style={{
                    color: activeSection === link.id ? "#34d399" : "#cbd5e1",
                  }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </motion.button>
              ))}

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-2.5 text-sm font-medium text-emerald-400 border border-emerald-400/50 rounded-lg hover:bg-emerald-400/10 transition-colors duration-200 w-fit"
              >
                <Download size={14} />
                Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
