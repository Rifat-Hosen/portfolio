"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "rifathosan01@gmail.com",
    href: "mailto:rifathosan01@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "Whatsapp",
    value: "+8801874499934",
    href: "tel:+8801874499934",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Gazipur, Dhaka, Bangladesh",
    href: null,
  },
];

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
  index,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass holographic-card p-6 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6 text-emerald-400" />
      </div>
      <p className="text-sm text-slate-400 mt-4">{label}</p>
      {href ? (
        <a
          href={href}
          className="text-white font-medium mt-1 block hover:text-emerald-400 transition-colors"
        >
          {value}
        </a>
      ) : (
        <p className="text-white font-medium mt-1">{value}</p>
      )}
    </motion.div>
  );
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* 3D Background Scene — ContactScene will be loaded here */}
      <div className="absolute inset-0 z-0 opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="section-label">GET IN TOUCH</span>
          <h2 className="section-heading">Let&apos;s Work Together</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto text-center mb-16"
        >
          Have a project in mind or want to collaborate? I&apos;d love to hear
          from you.
        </motion.p>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {contactInfo.map((info, index) => (
            <ContactCard key={info.label} {...info} index={index} />
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <a href="mailto:rifathosan01@gmail.com" className="btn-primary">
            Send a Message
            <Send className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/rifat-hosen/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Connect on LinkedIn
            <ExternalLink className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
