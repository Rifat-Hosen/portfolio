"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Code2, Brain, Rocket, type LucideIcon } from "lucide-react";

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: GraduationCap,
    title: "B.Sc. in CSE",
    description: "University of Rajshahi — Computer Science & Engineering",
  },
  {
    icon: Code2,
    title: "Full Stack Dev",
    description: "Next.js, Flutter, Node.js — building end-to-end solutions",
  },
  {
    icon: Brain,
    title: "1000+ Problems",
    description:
      "Competitive programming across Codeforces, LeetCode & more",
  },
  {
    icon: Rocket,
    title: "AI & Innovation",
    description:
      "Building AI assistants, speech recognition & ML projects",
  },
];

const bio = [
  "I'm a passionate Full Stack Software Engineer from Bangladesh with a B.Sc. in Computer Science and Engineering from the University of Rajshahi. Currently working as a Jr. Software Engineer at Dr. Reckendorfer Consulting, where I build innovative web and mobile solutions.",
  "My journey in tech spans across full-stack web development with Next.js, cross-platform mobile apps with Flutter, and AI-powered applications. I thrive on solving complex problems — having tackled over 1,000 challenges across competitive programming platforms including Codeforces, LeetCode, and UVA Online Judge.",
  "I believe in writing clean, efficient code and continuously pushing the boundaries of what's possible with modern technology.",
];

function HighlightCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div
        ref={cardRef}
        className="glass holographic-card p-6 text-center transition-transform duration-200 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="font-semibold text-white mt-4">{title}</h3>
        <p className="text-sm text-slate-400 mt-2">{description}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-24 md:py-32 relative overflow-hidden"
    >
      {/* 3D Background Scene — AboutScene will be loaded here */}
      <div className="absolute inset-0 z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">ABOUT ME</span>
          <h2 className="section-heading">Who I Am</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          {bio.map((paragraph, i) => (
            <p
              key={i}
              className="text-slate-300 leading-relaxed mb-4 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {highlights.map((highlight, index) => (
            <HighlightCard key={highlight.title} {...highlight} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
