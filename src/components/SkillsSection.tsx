"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Globe,
  Smartphone,
  FileCode,
  Server,
  Brain,
  Workflow,
  Puzzle,
  Users,
  BookOpen,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

const technicalSkills = [
  {
    name: "Backend Systems",
    icon: Server,
    focus: "Design and ship secure, realtime backend architecture",
    tools: ["Convex", "Better Auth", "Clerk", "Supabase", "PostgreSQL"],
  },
  {
    name: "Web Engineering",
    icon: Globe,
    focus: "Build production-grade web apps with modern React stack",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "Mobile Development",
    icon: Smartphone,
    focus: "Deliver cross-platform mobile experiences with clean architecture",
    tools: ["Flutter", "Dart", "MVVM", "REST API"],
  },
  {
    name: "Frontend Architecture",
    icon: FileCode,
    focus: "Create scalable UI systems with strong DX and accessibility",
    tools: ["Component Design", "State Management", "Accessibility", "UX"],
  },

  {
    name: "AI Integration",
    icon: Brain,
    focus: "Integrate AI features into real products and user workflows",
    tools: ["RAG", "LLM Integration", "FastAPI", "Flowise"],
  },
  {
    name: "Automation & Orchestration",
    icon: Workflow,
    focus: "Automate pipelines and orchestrate reliable deployments",
    tools: ["n8n", "Kubernetes", "GitHub Actions", "Vercel"],
  },
];

const softSkills = [
  {
    name: "Problem Solving",
    icon: Puzzle,
    description:
      "Break down complex product requirements into scalable, maintainable solutions with a strong debugging mindset.",
  },
  {
    name: "Team Collaboration",
    icon: Users,
    description:
      "Collaborate effectively with cross-functional remote teams across design, engineering, and product.",
  },
  {
    name: "Continuous Learning",
    icon: BookOpen,
    description:
      "Continuously upskill through hands-on projects, technical research, and practical experimentation.",
  },
  {
    name: "Communication",
    icon: MessageSquare,
    description:
      "Communicate technical decisions clearly with stakeholders, aligning business goals with implementation.",
  },
];

function TechnicalSkillCard({
  name,
  focus,
  tools,
  icon: Icon,
  index,
}: {
  name: string;
  focus: string;
  tools: string[];
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
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-white font-semibold">{name}</h4>
            <p className="text-sm text-slate-300 mt-1">{focus}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tools.map((tool) => (
            <span
              key={tool}
              className="px-2.5 py-1 text-xs rounded-full border border-emerald-500/30 text-emerald-300 bg-emerald-500/10"
            >
              {tool}
            </span>
          ))}
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
        className="glass holographic-card p-6 md:p-7 transition-transform duration-200 ease-out relative overflow-hidden group h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-300" />

        <div className="relative z-10 flex items-start justify-between gap-4 mb-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
            <Icon className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.12em] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
            Core Skill
          </span>
        </div>

        <div className="relative z-10">
          <h3 className="font-semibold text-white text-lg mb-2">{name}</h3>
          <p className="text-sm text-slate-300/95 leading-relaxed">
            {description}
          </p>
        </div>
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
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Placeholder for SkillsScene 3D background */}
      <div className="absolute inset-0 z-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label">SKILLS</span>
          <h2 className="section-heading">What I Work With</h2>
        </motion.div>

        {/* Technical Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-xl font-semibold text-white mb-8 text-center">
            Technical Stack
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-fr">
            {softSkills.map((skill, index) => (
              <SoftSkillCard key={skill.name} {...skill} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
