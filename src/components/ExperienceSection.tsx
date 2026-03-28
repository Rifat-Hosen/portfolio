"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Code2, type LucideIcon } from "lucide-react";

const experienceData = [
  {
    position: "Senior Software Engineer",
    company: "KI2 | KI-Quadrat Systemhaus GmbH",
    period: "2026 — Present",
    location: "Remote",
    description:
      "Leading development of scalable web, and AI-powered products. Driving architecture decisions and building RAG-based systems with strong focus on performance and maintainability.",
    icon: Code2,
    highlights: [
      "Built 5+ production Next.js applications",
      "Developed 3+ Convex backend systems",
      "Implemented RAG-based AI solutions",
      "Led technical architecture discussions",
    ],
  },
  {
    position: "Mid-Level Software Engineer",
    company: "KI2 | KI-Quadrat Systemhaus GmbH",
    period: "2024 — 2026",
    location: "Remote",
    description:
      "Transitioned into full-stack ownership by building scalable Next.js and Convex applications, integrating backend logic, and delivering end-to-end product modules.",
    icon: Code2,
    highlights: [
      "Delivered multiple full-stack modules end-to-end",
      "Built secure APIs and data models in Convex",
      "Improved deployment and debugging workflow",
      "Collaborated directly with stakeholders",
    ],
  },
  {
    position: "Junior Software Engineer",
    company: "Bizzntek Ltd.",
    period: "2024 — 2024",
    location: "Uttara, Dhaka, Bangladesh",
    description:
      "Worked on Flutter mobile development using MVVM architecture, Angular frontend development, and modern JavaScript technologies while shipping production features.",
    icon: Briefcase,
    highlights: [
      "Developed 2+ Flutter mobile applications with MVVM",
      "Built Angular-based web dashboards",
      "Collaborated with design and QA teams",
      "Improved app performance and code quality",
    ],
  },
  {
    position: "Software Engineer Intern",
    company: "Bizzntek Ltd.",
    period: "2024 — 2024",
    location: "Uttara, Dhaka, Bangladesh",
    description:
      "Started my professional journey by supporting mobile and web feature development, fixing UI issues, and learning production workflows with senior engineers.",
    icon: Briefcase,
    highlights: [
      "Built reusable UI components in Flutter",
      "Assisted with bug fixing and QA handoff",
      "Learned team Git workflow and code review",
      "Contributed to client feature delivery",
    ],
  },
];

function ExperienceCard({
  position,
  company,
  period,
  location,
  description,
  highlights,
  icon: Icon,
  index,
}: {
  position: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
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

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="relative pl-12 md:pl-16 pb-12 last:pb-0"
    >
      {/* Timeline dot connector */}
      <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 z-10" />

      <div
        ref={cardRef}
        className="glass holographic-card p-6 md:p-8 transition-transform duration-200 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{position}</h3>
                <p className="text-slate-400 text-sm">{company}</p>
              </div>
            </div>
          </div>
          <span
            suppressHydrationWarning
            className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm whitespace-nowrap"
          >
            {period}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-4">{location}</p>
        <p className="text-slate-300 leading-relaxed mb-4">{description}</p>

        {/* Highlights */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            Key Achievements
          </p>
          <ul className="space-y-1">
            {highlights.map((highlight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Floating geometric decorations */}
      <div
        className="absolute top-16 left-12 w-8 h-8 border border-emerald-500/30 rounded-full"
        style={{ animation: "spin 12s linear infinite" }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-6 h-6 border border-emerald-500/20 rounded-sm"
        style={{ animation: "spin 18s linear infinite reverse" }}
      />
      <div
        className="absolute bottom-24 left-16 w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "10px solid rgba(16,185,129,0.25)",
          animation: "spin 15s linear infinite",
        }}
      />
      <div
        className="absolute bottom-1/3 right-8 w-5 h-5 border border-emerald-500/20 rounded-full"
        style={{ animation: "spin 20s linear infinite" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label">WORK EXPERIENCE</span>
          <h2 className="section-heading">My Professional Journey</h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500 to-emerald-500/50" />

            {experienceData.map((entry, index) => (
              <ExperienceCard
                key={`${entry.position}-${entry.period}`}
                {...entry}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
