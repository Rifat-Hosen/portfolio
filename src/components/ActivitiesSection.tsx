"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Smartphone, Users, Globe, Mic, Code2, type LucideIcon } from "lucide-react";

const activities = [
  {
    title: "Austria Municipalities AI Assistant",
    description:
      "Built an AI-powered assistant for Austrian municipalities using Next.js, Supabase, N8N workflow automation, and Flowise AI integration.",
    icon: Bot,
    tags: ["Next.js", "Supabase", "N8N", "AI"],
  },
  {
    title: "Bangladesh SVRS Mobile App",
    description:
      "Developed the Bangladesh Sample Vital Statistics (SVRS) mobile application using Flutter with MVVM architecture and comprehensive software testing.",
    icon: Smartphone,
    tags: ["Flutter", "Dart", "MVVM", "Testing"],
  },
  {
    title: "Customer Portal",
    description:
      "Built a customer portal Flutter application with Supabase backend and integrated AI chatbot for customer support.",
    icon: Users,
    tags: ["Flutter", "Supabase", "ChatBot"],
  },
  {
    title: "KI Quadrat Platform",
    description:
      "Developed the KI Quadrat AI Assistant and organizational website using Next.js for a German AI consulting company.",
    icon: Globe,
    tags: ["Next.js", "AI", "Web App"],
  },
  {
    title: "Bangla Speech Recognition",
    description:
      "Research thesis on Transformer-Based End-to-End Speech Recognition for Bangla Language. Built a dataset of 14,000 sentences covering regional dialects.",
    icon: Mic,
    tags: ["Transformers", "Python", "NLP", "Research"],
  },
  {
    title: "Competitive Programming",
    description:
      "Solved 1000+ problems across Codeforces (350+), LeetCode (270+), UVA, LightOJ and other online judges. Focus on algorithms and data structures.",
    icon: Code2,
    tags: ["C++", "Algorithms", "DSA"],
  },
];

function ActivityCard({
  icon: Icon,
  title,
  description,
  tags,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
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
        className="glass holographic-card p-6 transition-transform duration-200 ease-out h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mt-4">{title}</h3>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="activities" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">PROJECTS & ACTIVITIES</span>
          <h2 className="section-heading">What I&apos;ve Built</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.title}
              {...activity}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
