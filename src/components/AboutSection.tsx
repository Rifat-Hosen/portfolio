"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  GraduationCap,
  Code2,
  Brain,
  Rocket,
  Briefcase,
  Layers,
  type LucideIcon,
} from "lucide-react";

const highlights: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Code2,
    title: "Full Stack Engineer",
    description:
      "Building end-to-end applications with Next.js, Convex, and Flutter",
  },
  {
    icon: Briefcase,
    title: "Senior Software Engineer",
    description: "Working remotely at KI2 | KI-Quadrat Systemhaus GmbH",
  },
  {
    icon: Layers,
    title: "Project Experience",
    description:
      "8+ Next.js apps, 5+ Convex backends, and 2+ Flutter mobile apps",
  },
  {
    icon: Brain,
    title: "AI Systems",
    description: "Developing RAG-based chatbots and intelligent applications",
  },
];

// const bio = [
//   "I'm a Full Stack Software Engineer from Bangladesh with a B.Sc. in Computer Science and Engineering from the University of Rajshahi. Currently working remotely as a Senior Software Engineer at KI2 | KI-Quadrat Systemhaus GmbH, where I build scalable and innovative digital solutions.",
//   "I specialize in full-stack web development with Next.js and Convex, cross-platform mobile app development with Flutter, and AI-powered applications including RAG-based chatbots. I focus on creating efficient, user-centric products that solve real-world problems.",
//   "Previously, I worked at Bizzntek Ltd. in Uttara, Dhaka, where I contributed as a Junior Software Engineer and earlier as a Software Engineer Intern, working with Flutter (MVVM), Angular, and modern JavaScript technologies.",
// ];

const bio = [
  "Full Stack Software Engineer from Bangladesh, currently working remotely as a Senior Software Engineer at KI2 | KI-Quadrat Systemhaus GmbH.",
  "I build scalable web, mobile, and AI-powered applications using Next.js, Convex, Flutter, and RAG-based systems.",
  "With 4+ years of experience, I have developed 8+ Next.js projects, 5+ Convex backends, and 2+ Flutter mobile apps, focusing on performance, scalability, and user experience.",
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
        className="glass holographic-card p-3 text-center transition-transform duration-200 ease-out h-full flex flex-col items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="font-semibold text-white mt-3 text-sm">{title}</h3>
        <p className="text-xs text-slate-400 mt-1.5">{description}</p>
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
      className="w-full py-16 md:py-24 relative overflow-hidden"
    >
      {/* 3D Background Scene — AboutScene will be loaded here */}
      <div className="absolute inset-0 z-0 opacity-30" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label">ABOUT ME</span>
          <h2 className="section-heading">Who I Am</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-12"
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
