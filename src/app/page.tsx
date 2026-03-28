"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EducationSection from "@/components/EducationSection";
import ExperienceSection from "@/components/ExperienceSection";
import SkillsSection from "@/components/SkillsSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
const AboutScene = dynamic(() => import("@/components/AboutScene"), {
  ssr: false,
});
const SkillsScene = dynamic(() => import("@/components/SkillsScene"), {
  ssr: false,
});
const EducationScene = dynamic(() => import("@/components/EducationScene"), {
  ssr: false,
});
const ExperienceScene = dynamic(() => import("@/components/ExperienceScene"), {
  ssr: false,
});
const ContactScene = dynamic(() => import("@/components/ContactScene"), {
  ssr: false,
});
const ActivitiesScene = dynamic(() => import("@/components/ActivitiesScene"), {
  ssr: false,
});

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const first = args[0];
      if (
        typeof first === "string" &&
        first.includes("THREE.THREE.Clock: This module has been deprecated")
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-screen bg-[#020617]">
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
        <HeroSection />
      </div>

      <div className="section-divider" />

      {/* About */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <AboutScene />
        </div>
        <AboutSection />
      </div>

      <div className="section-divider" />

      {/* Experience */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <ExperienceScene />
        </div>
        <ExperienceSection />
      </div>

      <div className="section-divider" />

      {/* Education */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <EducationScene />
        </div>
        <EducationSection />
      </div>

      <div className="section-divider" />

      {/* Skills */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <SkillsScene />
        </div>
        <SkillsSection />
      </div>

      <div className="section-divider" />

      {/* Activities */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <ActivitiesScene />
        </div>
        <ActivitiesSection />
      </div>

      <div className="section-divider" />

      {/* Contact */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <ContactScene />
        </div>
        <ContactSection />
      </div>

      <Footer />
    </main>
  );
}
