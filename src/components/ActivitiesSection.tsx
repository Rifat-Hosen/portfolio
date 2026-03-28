"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bot,
  Smartphone,
  Users,
  Globe,
  Mic,
  Code2,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

type ProjectLink = {
  label: string;
  href: string;
};

const activities = [
  {
    title: "Austria Municipalities AI Assistant",
    description:
      "Built an AI-powered assistant for Austrian municipalities using Next.js, Supabase, N8N workflow automation, and Flowise AI integration.",
    icon: Bot,
    tags: ["Next.js", "convex", "Clerk", "AI"],
    projectLinks: [
      { label: "Contract", href: "https://ki-quadrat.at/" },
      { label: "Live Demo", href: "http://admin.ki2.at/" },
    ],
  },
  {
    title: "KI Quadrat Platform Monolith Solution",
    description:
      "Built the KI Quadrat AI Assistant and company website with Next.js, delivering a monorepo-based SaaS platform with a separate admin portal.",
    icon: Globe,
    tags: ["Next.js", "Convex", "Better Auth", "SaaS"],
    projectLinks: [
      { label: "Live Demo", href: "https://monolith-super-admin.vercel.app" },
      {
        label: "Live Demo",
        href: "https://ki2-monolith-solution-moderator.vercel.app",
      },
      {
        label: "Live Demo",
        href: "https://ki2-monolith-solution-admin.vercel.app",
      },
    ],
  },
  {
    title: "Bangladesh SVRS Mobile App",
    description:
      "Developed the Bangladesh Sample Vital Statistics (SVRS) mobile application using Flutter with MVVM architecture and comprehensive software testing.",
    icon: Smartphone,
    tags: ["Flutter", "Dart", "MVVM", "QA", "GOVT"],
    projectLinks: [
      {
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=net.divineit.svrs.svrs&pcampaignid=web_share",
      },
    ],
  },
  {
    title: "Beetech Application",
    description:
      "Built a Flutter-based customer portal with a Java Spring Boot backend, now serving 50K+ users for customer support.",
    icon: Users,
    tags: ["Flutter","Cubit", "Mobile Application"],
    projectLinks: [
      {
        label: "Play Store",
        href: "https://play.google.com/store/apps/details?id=com.beetech.beetech_customer&pcampaignid=web_share",
      },
    ],
  },

  {
    title: "Bangla Speech Recognition",
    description:
      "Research thesis on Transformer-Based End-to-End Speech Recognition for Bangla Language. Built a dataset of 14,000 sentences covering regional dialects.",
    icon: Mic,
    tags: ["Transformers", "Python", "NLP", "Research"],
    projectLinks: [],
  },
  {
    title: "Competitive Programming",
    description:
      "Solved 1000+ problems across Codeforces (350+), LeetCode (270+), UVA, LightOJ and other online judges. Focus on algorithms and data structures.",
    icon: Code2,
    tags: ["C++", "Algorithms", "DSA"],
    projectLinks: [{ label: "LeetCode", href: "https://leetcode.com/u/rifathosan01/" }],
  },
];

function ActivityCard({
  icon: Icon,
  title,
  description,
  tags,
  projectLinks,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  projectLinks?: ProjectLink[];
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

        {projectLinks && projectLinks.length > 0 ? (
          <div className="flex flex-wrap items-center gap-3 mt-5">
            {projectLinks.map((link) => (
              <a
                key={`${title}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                {link.label}
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default function ActivitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="activities" ref={sectionRef} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-label">PROJECTS & ACTIVITIES</span>
          <h2 className="section-heading">What I&apos;ve Built</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <ActivityCard key={activity.title} {...activity} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
