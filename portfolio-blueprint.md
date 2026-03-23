# Portfolio Blueprint — Build with Claude Code CLI

> Complete guide to recreate this dark-themed, 3D-animated portfolio for a new person.
> Copy this file to any folder, open Claude Code CLI there, and paste the prompts.

---

## Table of Contents

1. [Tech Stack Overview](#1-tech-stack-overview)
2. [Project Setup (Step-by-Step)](#2-project-setup)
3. [Project Structure](#3-project-structure)
4. [Design System & Tokens](#4-design-system--tokens)
5. [Global CSS (copy exactly)](#5-global-css)
6. [Configuration Files](#6-configuration-files)
7. [Component Breakdown & Build Order](#7-component-breakdown--build-order)
8. [Claude Code Prompts (copy-paste ready)](#8-claude-code-prompts)
9. [Customization Checklist](#9-customization-checklist)
10. [Deployment](#10-deployment)

---

## 1. Tech Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | ^15 |
| UI Library | React | ^19 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Animations | Framer Motion | ^12.38 |
| 3D Graphics | Three.js | ^0.172 |
| 3D React | @react-three/fiber | ^9 |
| 3D Helpers | @react-three/drei | ^10 |
| Icons | Lucide React | ^0.577 |
| Package Manager | Bun | latest |
| Font | Inter (Google Fonts) | 300–800 |

---

## 2. Project Setup

### Step 1: Install Bun (if not installed)

```bash
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS / Linux
curl -fsSL https://bun.sh/install | bash
```

### Step 2: Create Next.js Project

```bash
bun create next-app portfolio --typescript --tailwind --eslint --app --src-dir --no-import-alias
cd portfolio
```

> When prompted: select **Yes** for TypeScript, Tailwind CSS, ESLint, App Router, `src/` directory. Select **No** for import alias customization (we'll set it up manually).

### Step 3: Install Dependencies

```bash
bun add three @react-three/fiber @react-three/drei framer-motion lucide-react
bun add -d @types/three
```

### Step 4: Verify package.json dependencies match

```json
{
  "dependencies": {
    "@react-three/drei": "^10",
    "@react-three/fiber": "^9",
    "framer-motion": "^12.38.0",
    "lucide-react": "^0.577.0",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "three": "^0.172"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.172",
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "^15"
  }
}
```

### Step 5: Verify it runs

```bash
bun dev
```

Open `http://localhost:3000` — you should see the Next.js starter page.

---

## 3. Project Structure

```
portfolio/
├── public/
│   └── resume.pdf                    # Person's CV/resume
├── src/
│   ├── app/
│   │   ├── globals.css               # Global styles, animations, glass effects
│   │   ├── layout.tsx                # Root layout (metadata, fonts)
│   │   └── page.tsx                  # Main page (assembles all sections)
│   └── components/
│       ├── Navbar.tsx                # Fixed top nav with mobile hamburger
│       ├── HeroSection.tsx           # Hero: name, typewriter, stats, CTA
│       ├── AboutSection.tsx          # About: bio, highlight cards, 3D molecules
│       ├── EducationSection.tsx      # Education: timeline cards
│       ├── SkillsSection.tsx         # Skills: grid cards + 3D constellation
│       ├── ActivitiesSection.tsx     # Projects/activities: card grid
│       ├── ContactSection.tsx        # Contact: info cards, CTA, 3D globe
│       ├── Footer.tsx                # Simple footer
│       ├── Scene.tsx                 # Hero 3D scene (morphing sphere, DNA helix)
│       ├── AboutScene.tsx            # About 3D background (molecule structures)
│       ├── SkillsScene.tsx           # Skills 3D constellation (interactive nodes)
│       └── ContactScene.tsx          # Contact 3D globe (wireframe + arcs)
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

---

## 4. Design System & Tokens

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#020617` | Page background (slate-950) |
| `bg-card` | `rgba(15, 23, 42, 0.65)` | Glass card background |
| `bg-card-hover` | `rgba(15, 23, 42, 0.85)` | Glass card hover |
| `text-primary` | `#f8fafc` | Headings (slate-50) |
| `text-body` | `#e2e8f0` | Body text (slate-200) |
| `text-muted` | `#94a3b8` | Muted/secondary text (slate-400) |
| `text-subtle` | `#cbd5e1` | Subtle text (slate-300) |
| `accent-green` | `#10b981` | Primary accent (emerald-500) |
| `accent-green-light` | `#34d399` | Labels, highlights (emerald-400) |
| `accent-green-lighter` | `#6ee7b7` | Subtle accents (emerald-300) |
| `accent-green-dark` | `#059669` | Button background (emerald-600) |
| `accent-amber` | `#fbbf24` | Secondary accent (amber-400) |
| `border-default` | `rgba(148, 163, 184, 0.12)` | Card borders |
| `border-hover` | `rgba(16, 185, 129, 0.35)` | Card hover borders |
| `scrollbar-track` | `#0f172a` | Scrollbar track |
| `scrollbar-thumb` | `#334155` | Scrollbar thumb |
| `selection-bg` | `rgba(16, 185, 129, 0.3)` | Text selection |

### Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Section heading | 2.5rem / 3rem (md) | 800 | #f8fafc |
| Section label | 0.875rem uppercase | 600 | #34d399 |
| Body | 1rem | 400 | #e2e8f0 |
| Button | 1.0625rem | 600 | #fff |

### Spacing

| Context | Value |
|---------|-------|
| Section padding | `py-24 md:py-32` |
| Container | `max-w-7xl mx-auto px-6` |
| Card padding | `p-6` to `p-8` |
| Card border radius | `1.25rem` (rounded-2xl) |
| Button border radius | `9999px` (fully rounded / pill) |

### Effects

| Effect | Implementation |
|--------|----------------|
| Glassmorphism | `backdrop-filter: blur(18px)` + semi-transparent bg |
| Holographic border | Animated gradient `::before` with mask-composite |
| Glow | `box-shadow` with emerald rgba values |
| 3D tilt cards | CSS `perspective(1000px)` + `rotateX/rotateY` on mousemove |
| Scroll animations | Framer Motion `useInView` + `motion.div` |

---

## 5. Global CSS

Copy this exactly into `src/app/globals.css`:

```css
@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  overflow-x: hidden;
}

body {
  color: #e2e8f0;
  background: #020617;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  line-height: 1.7;
  overflow-x: hidden;
  width: 100%;
}

::selection {
  background-color: rgba(16, 185, 129, 0.3);
  color: #fff;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0f172a;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

/* ── Animations ── */

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 300% 300%;
  animation: gradient-shift 5s ease infinite;
}

/* ── Glass card ── */

.glass {
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 1.25rem;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.glass:hover {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(15, 23, 42, 0.85);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(16, 185, 129, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.glow-green {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.2), 0 0 80px rgba(16, 185, 129, 0.06);
}

/* ── Holographic border effect ── */

@keyframes holographic {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.holographic-card {
  position: relative;
  overflow: visible;
}

.holographic-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.6),
    rgba(251, 191, 36, 0.5),
    rgba(52, 211, 153, 0.6),
    rgba(16, 185, 129, 0.6)
  );
  background-size: 300% 300%;
  animation: holographic 4s ease infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 1;
}

.holographic-card:hover::before {
  opacity: 1;
}

/* ── Glow pulse ── */

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.1); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.25), 0 0 80px rgba(16, 185, 129, 0.1); }
}

.glow-pulse {
  animation: glow-pulse 3s ease-in-out infinite;
}

/* ── Section styles ── */

.section-heading {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;
  text-align: center;
}

@media (min-width: 768px) {
  .section-heading {
    font-size: 3rem;
  }
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #34d399;
  margin-bottom: 0.75rem;
  text-align: center;
}

/* ── Button base ── */

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border-radius: 9999px;
  background: #059669;
  color: #fff;
  font-weight: 600;
  font-size: 1.0625rem;
  padding: 0.875rem 2rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover {
  background: #10b981;
  box-shadow:
    0 0 30px rgba(16, 185, 129, 0.3),
    0 10px 30px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px) scale(1.02);
}

.btn-primary:hover::after {
  transform: translateX(100%);
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  border-radius: 9999px;
  background: transparent;
  color: #cbd5e1;
  font-weight: 600;
  font-size: 1.0625rem;
  padding: 0.875rem 2rem;
  border: 1.5px solid #334155;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-decoration: none;
  cursor: pointer;
}

.btn-outline:hover {
  border-color: #10b981;
  color: #34d399;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
}

/* ── Divider between sections ── */

.section-divider {
  width: 100%;
  max-width: 120px;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.3), transparent);
}
```

---

## 6. Configuration Files

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

### `postcss.config.mjs`

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 7. Component Breakdown & Build Order

Build in this exact order (dependencies flow top-down):

### Phase 1: Foundation

| # | File | What it does |
|---|------|-------------|
| 1 | `globals.css` | All global styles (copy from Section 5) |
| 2 | `layout.tsx` | Root layout: metadata, Google Fonts (Inter 300-800), `<html lang="en" className="scroll-smooth">` |
| 3 | `page.tsx` | Client component that imports and renders all sections in order |

### Phase 2: Static Sections (no 3D)

| # | File | Key Features |
|---|------|-------------|
| 4 | `Navbar.tsx` | Fixed glassmorphic nav, mobile hamburger (Menu/X icons), nav links with active section detection via IntersectionObserver, "Resume" download link |
| 5 | `Footer.tsx` | Simple centered footer with copyright + "Made with heart" |
| 6 | `HeroSection.tsx` | Full viewport hero, typewriter effect cycling words, animated stat counters, floating dot particles, mouse-following gradient orbs, rotating ring decorations, two CTA buttons (primary + outline) |
| 7 | `AboutSection.tsx` | Bio paragraph, 4 highlight cards with 3D tilt on mousemove (perspective transform), section label + heading |
| 8 | `EducationSection.tsx` | Vertical timeline with connecting line, education cards with 3D tilt, floating geometric decorations |
| 9 | `SkillsSection.tsx` | Two grids — hard skills (with progress bars) and soft skills (with icon + description), glass cards with tilt |
| 10 | `ActivitiesSection.tsx` | Card grid of projects/activities with tags, icons, tilt effect |
| 11 | `ContactSection.tsx` | 3 contact info cards (email, phone, location), large CTA button |

### Phase 3: 3D Scenes (loaded with `next/dynamic`, `ssr: false`)

| # | File | 3D Elements |
|---|------|------------|
| 12 | `Scene.tsx` | Morphing organic sphere (simplex noise on vertices), DNA double helix (InstancedMesh), glow particles (custom shader), glass orbs, floating torus rings, energy rings orbiting sphere, mouse-reactive CameraRig |
| 13 | `AboutScene.tsx` | 3 molecule structures (hexagonal glucose, chain amino acid, ring vitamin), ambient floating particles |
| 14 | `SkillsScene.tsx` | 15 interactive skill nodes on golden spiral sphere, connection lines between nearby nodes, ambient particle field, orbit controls |
| 15 | `ContactScene.tsx` | Wireframe globe with dots at lat/lon intersections, location marker (pulsing at person's city), arc connections to world cities, latitude/longitude grid lines |

---

## 8. Claude Code Prompts (Copy-Paste Ready)

Open Claude Code CLI in your new empty project folder and run these prompts in order.

---

### PROMPT 1 — Project Init

```
Create a new Next.js 15 portfolio project using Bun. Run these commands:

bun create next-app . --typescript --tailwind --eslint --app --src-dir

Then install: three @react-three/fiber @react-three/drei framer-motion lucide-react
And dev dep: @types/three

After install, verify bun dev works.
```

---

### PROMPT 2 — Config & Global Styles

```
Set up the project foundation:

1. Replace globals.css with this exact dark-themed design system (I'll provide below).
2. Update layout.tsx with:
   - Metadata for "[PERSON NAME] | [FIELD]"
   - Google Fonts: Inter weights 300-800 via <link> tags in <head>
   - <html lang="en" className="scroll-smooth">
   - <body className="antialiased">
3. Make sure postcss.config.mjs uses @tailwindcss/postcss
4. Make sure next.config.ts has reactStrictMode: true
5. Ensure tsconfig.json has path alias @/* -> ./src/*

Here's the globals.css content:
[PASTE THE ENTIRE globals.css FROM SECTION 5 ABOVE]
```

---

### PROMPT 3 — Navbar + Footer + Page Shell

```
Build the Navbar, Footer, and main page shell for a dark-themed portfolio.

DESIGN SYSTEM: Dark background (#020617), emerald green accents (#10b981, #34d399),
glassmorphic cards, Inter font, Framer Motion animations.

Navbar.tsx ("use client"):
- Fixed top, z-50, glassmorphic background (backdrop-blur)
- Left: Person's name/logo as text
- Center/Right: nav links — Home, About, Education, Skills, Activities, Contact
- Far right: "Resume" button linking to /resume.pdf (target _blank)
- Mobile: hamburger menu (Lucide Menu/X icons) with slide-down overlay
- Active section detection using IntersectionObserver
- Background becomes more opaque on scroll
- Smooth scroll to sections on click

Footer.tsx ("use client"):
- Simple centered footer
- "© 2025 [PERSON NAME]. All rights reserved."
- "Made with ❤ by [PERSON NAME]" in muted text

page.tsx ("use client"):
- Import and render in order: Navbar, HeroSection, AboutSection, EducationSection,
  SkillsSection, ActivitiesSection, ContactSection, Footer
- Add .section-divider div between each major section
- Each section wrapped with an id for anchor navigation
```

---

### PROMPT 4 — Hero Section

```
Build HeroSection.tsx — the full-viewport hero section.

PERSON INFO (customize these):
- Name: [FULL NAME]
- Tagline words (typewriter cycle): ["Word1", "Word2", "Word3", "Word4"]
- Stats: [{ label: "...", value: N }, { label: "...", value: N }, ...]
- Primary CTA: "Get In Touch" → scrolls to #contact
- Secondary CTA: "Learn More" → scrolls to #about

FEATURES:
- Full min-h-screen with relative positioning
- Typewriter effect: cycles through tagline words with blinking cursor
- Animated count-up for stats (animate from 0 to target on mount)
- Floating decorative dots (small colored circles with random positions and animations)
- Mouse-following gradient orbs (track cursor position with lag)
- Decorative rotating rings (thin border circles, absolute positioned)
- Framer Motion entrance animations (fade-up stagger)
- The 3D Scene component will be added later — leave a div placeholder for it
  (absolute positioned, full section size, z-0, loaded with next/dynamic ssr:false)

Use: "use client", framer-motion, lucide-react icons, Tailwind classes.
Use the .btn-primary and .btn-outline CSS classes from globals.css for buttons.
```

---

### PROMPT 5 — About Section

```
Build AboutSection.tsx — the about/bio section.

PERSON INFO (customize):
- Bio: [2-3 paragraph bio text]
- Highlights: 4 cards, each with { icon, title, description }
  Example: { icon: GraduationCap, title: "B.Sc. Student", description: "..." }

FEATURES:
- Section id="about", py-24 md:py-32
- Section label ("ABOUT ME") + section heading
- Bio paragraph(s) with max-w-3xl, centered, slate-300 text
- 4 highlight cards in a responsive grid (1 col mobile, 2 col sm, 4 col md)
- Each card: glass card with holographic-card class, icon in emerald circle,
  title, description, 3D tilt effect on mousemove (perspective + rotateX/Y transform)
- Framer Motion scroll-triggered entrance animations (useInView)
- Leave a div placeholder for AboutScene (3D molecule background),
  loaded with next/dynamic ssr:false, absolute positioned behind content
```

---

### PROMPT 6 — Education Section

```
Build EducationSection.tsx — education timeline.

PERSON INFO (customize):
- Education entries: [
    { degree: "...", institution: "...", year: "...", description: "...", gpa: "..." },
    ...
  ]

FEATURES:
- Section id="education", dark background
- Section label + heading
- Vertical timeline with a thin green connecting line on the left (or center on desktop)
- Each entry: glass card with 3D tilt, showing degree, institution, year badge,
  description, GPA if available
- Floating geometric decorations (small rotating squares/circles, absolute positioned)
- Framer Motion staggered entrance from alternating sides
- Responsive: stack vertically on mobile
```

---

### PROMPT 7 — Skills Section

```
Build SkillsSection.tsx — technical and soft skills.

PERSON INFO (customize):
- Hard/Technical skills: [{ name: "...", level: N (0-100), icon: IconName }]
  (4-6 skills with proficiency percentage)
- Soft skills: [{ name: "...", icon: IconName, description: "..." }]
  (4-6 soft skills)

FEATURES:
- Section id="skills"
- Section label + heading
- Two subsections: "Technical Skills" and "Soft Skills"
- Technical: glass cards with icon, skill name, animated progress bar
  (fills to percentage on scroll into view), percentage label
- Soft: glass cards with icon, skill name, short description
- All cards have 3D tilt effect and holographic border on hover
- Responsive grid layout
- Leave placeholder for SkillsScene (3D skill constellation),
  loaded with next/dynamic ssr:false
- Framer Motion scroll-triggered stagger animations
```

---

### PROMPT 8 — Activities Section

```
Build ActivitiesSection.tsx — projects and extracurricular activities.

PERSON INFO (customize):
- Activities: [
    { title: "...", description: "...", icon: IconName, tags: ["Tag1", "Tag2"] },
    ...
  ]
  (4-6 activities/projects)

FEATURES:
- Section id="activities"
- Section label + heading
- Responsive card grid (1 col mobile, 2 col md)
- Each card: glass + holographic-card, icon in colored circle, title,
  description, tags as small pill badges (emerald-tinted)
- 3D tilt on mousemove
- Framer Motion scroll-triggered stagger entrance
```

---

### PROMPT 9 — Contact Section

```
Build ContactSection.tsx — contact information and CTA.

PERSON INFO (customize):
- Email: [email]
- Phone: [phone]
- Location: [city, country]

FEATURES:
- Section id="contact"
- Section label + heading + subtitle paragraph
- 3 contact cards in a row (responsive): Email (Mail icon), Phone (Phone icon),
  Location (MapPin icon) — each a glass card with hover glow
- Email card: mailto link, Phone card: tel link
- Large CTA button: "Send a Message" with Send icon, links to mailto
- Leave placeholder for ContactScene (3D wireframe globe),
  loaded with next/dynamic ssr:false
- Framer Motion entrance animations
```

---

### PROMPT 10 — Hero 3D Scene

```
Build Scene.tsx — the 3D scene for the hero section using @react-three/fiber.

This is a "use client" component wrapped in a Canvas from @react-three/fiber.

3D ELEMENTS:
1. MorphingSphere: A sphere geometry whose vertices are displaced by simplex/perlin
   noise, animated over time. Emerald-green MeshStandardMaterial with slight emissive
   glow. Slowly rotates.

2. DNAHelix: Double helix structure made with InstancedMesh for performance.
   ~100 small spheres arranged in two interleaving helical paths.
   Slowly rotates around Y axis. Semi-transparent material.

3. GlowParticles: ~200 particles using Points geometry with custom ShaderMaterial.
   Vertex shader: oscillating position. Fragment shader: radial glow falloff.
   Emerald/teal colors, varying sizes and opacities.

4. GlassOrb: 2-3 floating transparent spheres with MeshPhysicalMaterial
   (transmission, roughness, ior). Slowly orbit.

5. FloatingRing: 2-3 Torus geometries, thin, slowly rotating on different axes.
   Wireframe or semi-transparent material.

6. EnergyRing: Thin torus orbiting the central MorphingSphere with a trail effect.

7. CameraRig: Moves the camera slightly based on mouse position for parallax.
   Uses useFrame and pointer state from @react-three/fiber.

SCENE SETUP:
- Canvas with camera fov=60, position [0,0,6]
- ambientLight intensity 0.3
- directionalLight for key lighting
- Fog for depth
- All elements centered around origin
- Responsive: works on mobile (fewer particles if needed)
```

---

### PROMPT 11 — About 3D Scene

```
Build AboutScene.tsx — 3D molecular structures for the about section background.

3D ELEMENTS:
1. Molecule component (reusable): Takes atom positions and bond connections.
   Renders spheres for atoms and cylinders for bonds.
   Three preset molecules at different positions:
   - Hexagonal ring (like glucose) at position [-3, 1, 0]
   - Chain structure (like amino acid) at position [3, -1, 0]
   - Ring structure (like vitamin) at position [0, 2, -2]
   Each slowly rotates on different axes.

2. AboutParticles: ~150 small ambient particles floating with subtle drift animation.
   Low opacity, white/emerald tinted.

SCENE SETUP:
- Canvas with camera fov=50
- Soft ambient + directional lighting
- Low opacity overall (this is a background element)
- All materials semi-transparent emerald/teal tones
```

---

### PROMPT 12 — Skills 3D Constellation

```
Build SkillsScene.tsx — interactive 3D skill constellation.

3D ELEMENTS:
1. SkillNode: Small sphere (or icosahedron) representing each skill.
   ~15 nodes distributed on a sphere surface using golden spiral (Fibonacci sphere).
   Each node has a text label (Html from @react-three/drei or Billboard+Text).
   On hover: scale up, glow effect, show skill name.
   Color varies by skill category.

2. ConnectionLines: Lines connecting nodes that are within a certain distance.
   Use THREE.Line or BufferGeometry with LineBasicMaterial.
   Low opacity, emerald tinted. Animate opacity subtly.

3. ConstellationParticles: ~200 ambient particles in the background.

4. OrbitControls from @react-three/drei: enableZoom=false, autoRotate=true,
   autoRotateSpeed=0.5, enablePan=false.

SCENE SETUP:
- Canvas filling the section
- Camera at [0, 0, 8]
- Minimal lighting
- The skill names should match the person's actual skills from SkillsSection
```

---

### PROMPT 13 — Contact 3D Globe

```
Build ContactScene.tsx — wireframe globe for the contact section.

3D ELEMENTS:
1. WireframeGlobe: A sphere made of dots at latitude/longitude intersections.
   - Generate points at regular lat/lon intervals on a sphere surface
   - Render as Points geometry (small dots)
   - Add latitude and longitude grid lines as thin LineLoop geometries
   - Slowly auto-rotates on Y axis

2. LocationMarker: A small glowing sphere + pulsing ring at the person's city
   coordinates (convert lat/lon to 3D sphere coordinates).
   City: [PERSON'S CITY]

3. ConnectionArcs: Curved arcs from the person's location to 3-4 world cities.
   Use QuadraticBezierCurve3 or CubicBezierCurve3, elevated above the globe surface.
   Animated dash effect or gradient opacity along the arc.

SCENE SETUP:
- Canvas with camera at [0, 0, 4]
- Ambient light only (subtle)
- Globe radius ~1.5
- Emerald/teal color scheme matching the rest of the site
- Slow auto-rotation
```

---

### PROMPT 14 — Polish & Integration

```
Review all components and fix any issues:

1. Make sure all 3D scenes are loaded with next/dynamic and ssr: false
2. Verify all section ids match navbar links
3. Check mobile responsiveness — test hamburger menu, card grids stack properly
4. Ensure Framer Motion animations don't cause layout shift
5. Verify all imports are correct and there are no TypeScript errors
6. Run "bun build" and fix any build errors
7. Test smooth scrolling between sections
8. Make sure the resume download link works (file must be in /public)
```

---

## 9. Customization Checklist

Replace these for each new person:

| Item | Location | Example |
|------|----------|---------|
| **Full Name** | Navbar, Hero, Footer, metadata | "John Doe" |
| **Field/Title** | Hero subtitle, metadata | "Software Engineer" |
| **Typewriter Words** | HeroSection | ["Developer", "Creator", "Innovator"] |
| **Stats** | HeroSection | [{ label: "Projects", value: 15 }] |
| **Bio Text** | AboutSection | 2-3 paragraphs about the person |
| **Highlight Cards** | AboutSection | 4 cards with relevant achievements |
| **Education** | EducationSection | Degree, school, year, GPA |
| **Hard Skills** | SkillsSection | Skills + proficiency % |
| **Soft Skills** | SkillsSection | Skills + descriptions |
| **Activities** | ActivitiesSection | Projects, clubs, volunteer work |
| **Email** | ContactSection | person@email.com |
| **Phone** | ContactSection | +1234567890 |
| **Location** | ContactSection + ContactScene | City, Country |
| **Resume PDF** | public/resume.pdf | Upload actual PDF |
| **Globe Marker** | ContactScene | Lat/Lon of person's city |
| **Accent Color** | globals.css (optional) | Change emerald to any color |
| **Metadata** | layout.tsx | Title, description, keywords |

---

## 10. Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel

# Or connect GitHub repo at vercel.com for auto-deploys
```

### Build Locally

```bash
bun run build    # Creates .next/ production build
bun run start    # Starts production server on port 3000
```

### Netlify Alternative

```bash
bun run build
# Deploy .next/ folder or use Netlify's Next.js plugin
```

---

## Quick Start Summary

```bash
# 1. Create project
mkdir portfolio && cd portfolio
bun create next-app . --typescript --tailwind --eslint --app --src-dir

# 2. Install deps
bun add three @react-three/fiber @react-three/drei framer-motion lucide-react
bun add -d @types/three

# 3. Open Claude Code
claude

# 4. Paste prompts 2-14 one by one, customizing [PERSON INFO] each time

# 5. Test
bun dev

# 6. Deploy
vercel
```

---

**Total build time with Claude Code: ~30-60 minutes depending on customization.**
