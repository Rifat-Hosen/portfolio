"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  Smartphone,
  FileCode,
  Server,
  Brain,
  Container,
  Puzzle,
  Users,
  BookOpen,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const technicalSkills = [
  { name: "Next.js", level: 90, icon: Globe },
  { name: "Flutter/Dart", level: 85, icon: Smartphone },
  { name: "TypeScript", level: 80, icon: FileCode },
  { name: "Node.js", level: 70, icon: Server },
  { name: "Python / ML", level: 55, icon: Brain },
  { name: "Docker / DevOps", level: 50, icon: Container },
];

const softSkills = [
  {
    name: "Problem Solving",
    icon: Puzzle,
    description:
      "1000+ competitive programming problems solved across multiple platforms",
  },
  {
    name: "Team Collaboration",
    icon: Users,
    description:
      "Experience working in remote and on-site development teams",
  },
  {
    name: "Continuous Learning",
    icon: BookOpen,
    description:
      "Always expanding skills through courses, certifications and practice",
  },
  {
    name: "Communication",
    icon: MessageSquare,
    description:
      "Clear technical communication with team members and stakeholders",
  },
];

function TechnicalSkillCard({
  name,
  level,
  icon: Icon,
  index,
}: {
  name: string;
  level: number;
  icon: LucideIcon;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, { once: true, margin: "-50px" });

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div
        ref={cardRef}
        className="glass holographic-card p-6 transition-transform duration-200 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-white font-semibold">{name}</span>
          </div>
          <span className="text-emerald-400 text-sm font-medium">
            {level}%
          </span>
        </div>

        {/* Progress bar */}
        <div ref={barRef} className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isInView ? `${level}%` : "0%",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function SoftSkillCard({
  name,
  icon: Icon,
  description,
  index,
}: {
  name: string;
  icon: LucideIcon;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div
        ref={cardRef}
        className="glass holographic-card p-6 transition-transform duration-200 ease-out"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="font-semibold text-white mb-2">{name}</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Placeholder for SkillsScene 3D background */}
      <div className="absolute inset-0 z-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">SKILLS</span>
          <h2 className="section-heading">What I Work With</h2>
        </motion.div>

        {/* Technical Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-xl font-semibold text-white mb-8 text-center">
            Technical Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technicalSkills.map((skill, index) => (
              <TechnicalSkillCard key={skill.name} {...skill} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Soft Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-8 text-center">
            Soft Skills
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {softSkills.map((skill, index) => (
              <SoftSkillCard key={skill.name} {...skill} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
