"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, Award, type LucideIcon } from "lucide-react";

const educationData = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "University of Rajshahi",
    year: "2018 — 2023",
    description:
      "Focused on algorithms, data structures, machine learning and software engineering. Completed thesis on Transformer-Based End-to-End Speech Recognition System for Bangla Language.",
    icon: GraduationCap,
  },
  {
    degree: "Certifications & Courses",
    institution: "Coursera, Udemy, KodeKloud",
    year: "2022 — 2024",
    description:
      "Next.js 15, Machine Learning (Andrew Ng), Neural Networks & Deep Learning, TensorFlow for AI/ML/DL, Docker Training.",
    icon: Award,
  },
];

function TimelineCard({
  degree,
  institution,
  year,
  description,
  icon: Icon,
  index,
}: {
  degree: string;
  institution: string;
  year: string;
  description: string;
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
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm">
            {year}
          </span>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-1">{degree}</h3>
        <p className="text-slate-400 text-sm mb-3">{institution}</p>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="education"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Floating geometric decorations */}
      <div
        className="absolute top-16 right-12 w-8 h-8 border border-emerald-500/30 rounded-sm"
        style={{ animation: "spin 12s linear infinite" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-6 h-6 border border-emerald-500/20 rounded-full"
        style={{ animation: "spin 18s linear infinite reverse" }}
      />
      <div
        className="absolute bottom-24 right-16 w-0 h-0"
        style={{
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "10px solid rgba(16,185,129,0.25)",
          animation: "spin 15s linear infinite",
        }}
      />
      <div
        className="absolute bottom-1/3 left-8 w-5 h-5 border border-emerald-500/20 rounded-sm"
        style={{ animation: "spin 20s linear infinite" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">EDUCATION</span>
          <h2 className="section-heading">My Journey</h2>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 via-emerald-500 to-emerald-500/50" />

            {educationData.map((entry, index) => (
              <TimelineCard key={entry.degree} {...entry} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
