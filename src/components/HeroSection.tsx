"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

/* ── Data ── */
const taglines = [
  "Full Stack Developer",
  "Building with Next.js & Convex",
  "Flutter Mobile Expert",
  "AI-Powered Solutions Creator",
];

const stats: { label: string; value: number }[] = [
  { label: "Next.js Projects Built", value: 8 },
  { label: "Convex Projects Built", value: 5 },
  { label: "Flutter Mobile Apps", value: 2 },
  { label: "Years Experience", value: 4 },
];

/* ── Helpers ── */
const formatStat = (value: number) =>
  value >= 1000 ? `${value}+` : `${value}`;

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      started.current = false;
    };
  }, [target, duration]);

  return count;
}

/* ── Stat card sub-component ── */
function StatCard({ label, value }: { label: string; value: number }) {
  const count = useCountUp(value, 2000);
  return (
    <div className="glass px-6 py-5 text-center min-w-[140px] flex-1">
      <p className="text-3xl md:text-4xl font-bold text-emerald-400">
        {formatStat(count)}
      </p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </div>
  );
}

/* ── Main component ── */
const HeroSection = () => {
  /* Typewriter state */
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  /* Mouse-following gradient orbs */
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const smoothPos = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Typewriter effect ── */
  useEffect(() => {
    const current = taglines[taglineIndex];
    const typeSpeed = isDeleting ? 40 : 80;
    const pauseDelay = isDeleting ? 0 : 1800;

    if (!isDeleting && charIndex === current.length) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDelay);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, taglineIndex]);

  /* ── Mouse-follow lerp loop ── */
  const lerpLoop = useCallback(() => {
    const lerp = 0.08;
    smoothPos.current.x += (mousePos.x - smoothPos.current.x) * lerp;
    smoothPos.current.y += (mousePos.y - smoothPos.current.y) * lerp;

    const orb1 = document.getElementById("orb-1");
    const orb2 = document.getElementById("orb-2");

    if (orb1) {
      orb1.style.transform = `translate(${smoothPos.current.x * 100 - 50}%, ${
        smoothPos.current.y * 100 - 50
      }%)`;
    }
    if (orb2) {
      orb2.style.transform = `translate(${
        smoothPos.current.x * -80 + 40
      }%, ${smoothPos.current.y * -80 + 40}%)`;
    }

    rafRef.current = requestAnimationFrame(lerpLoop);
  }, [mousePos]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(lerpLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [lerpLoop]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  /* ── Framer Motion variants ── */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  const currentText = taglines[taglineIndex].slice(0, charIndex);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background gradient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Mouse-following gradient orbs ── */}
      <div
        id="orb-1"
        className="pointer-events-none absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)",
          top: "20%",
          left: "30%",
        }}
      />
      <div
        id="orb-2"
        className="pointer-events-none absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.5) 0%, transparent 70%)",
          top: "50%",
          right: "20%",
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Sparkle badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 glass px-4 py-2 text-sm text-emerald-400 font-medium rounded-full">
            <Sparkles className="w-4 h-4" />
            Available for work
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div variants={fadeUp}>
          <p className="text-lg md:text-xl text-slate-400 mb-2">
            Hello, I&apos;m
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Rifat Hosen
            </span>
          </h1>
        </motion.div>

        {/* Typewriter */}
        <motion.p
          variants={fadeUp}
          className="mt-4 text-xl md:text-2xl text-slate-300"
        >
          I&apos;m a{" "}
          <span className="text-emerald-400 font-semibold">{currentText}</span>
          <span className="animate-pulse text-emerald-400 ml-0.5">|</span>
        </motion.p>

        {/* Intro paragraph */}
        <motion.p
          variants={fadeUp}
          className="mt-6 text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
        >
          Full-stack developer building scalable, user-focused applications with
          Next.js, Convex, and Flutter. Passionate about integrating
          AI—especially RAG-based chatbots—to create smart, efficient solutions
          that turn complex ideas into seamless digital experiences.
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap justify-center gap-4 md:gap-6"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#contact" className="btn-primary">
            Get In Touch
            <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#about" className="btn-outline">
            Learn More
            <ChevronDown className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
