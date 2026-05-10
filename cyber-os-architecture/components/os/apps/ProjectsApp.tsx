"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github, Rocket, Sparkles, Code2, ShieldCheck, Gamepad2, BrainCircuit } from "lucide-react"

interface Project {
  name: string
  status: "Live" | "In progress" | "Concept"
  description: string
  impact: string
  tech: string[]
  icon: typeof Rocket
  accent: string
  repoUrl?: string
  demoUrl?: string
}

const projects: Project[] = [
  {
    name: "CyberOS Portfolio",
    status: "Live",
    description:
      "Interactive portfolio designed as a cyberpunk operating system with draggable windows, apps, terminal, notes and mini-games.",
    impact: "Turns a simple portfolio into an explorable product experience.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    icon: Rocket,
    accent: "from-cyan-400/25 to-blue-500/10",
    repoUrl: "https://github.com/Reliceas/cyber-os-web-site",
  },
  {
    name: "AI Research Hub",
    status: "Concept",
    description:
      "A workspace for comparing AI models, collecting prompts, and tracking which model works best for each task.",
    impact: "Helps choose the right AI tool faster instead of guessing.",
    tech: ["AI", "Prompt Engineering", "Research", "UX"],
    icon: BrainCircuit,
    accent: "from-purple-400/25 to-pink-500/10",
  },
  {
    name: "Game Optimization Scripts",
    status: "In progress",
    description:
      "Windows performance tweaks, network optimization ideas, and gaming-focused system automation experiments.",
    impact: "Targets smoother gameplay, lower latency and cleaner system setup.",
    tech: ["PowerShell", "Windows", "Networking", "Automation"],
    icon: ShieldCheck,
    accent: "from-emerald-400/25 to-green-500/10",
  },
  {
    name: "Neon Snake Module",
    status: "Live",
    description:
      "A glowing canvas-based mini-game inside CyberOS with motion trails, color shifts and dashboard-style controls.",
    impact: "Adds personality and playfulness to the portfolio experience.",
    tech: ["Canvas", "React", "Animation", "Game UI"],
    icon: Gamepad2,
    accent: "from-lime-400/25 to-cyan-500/10",
  },
]

const stats = [
  { label: "Portfolio modules", value: "11" },
  { label: "Core stack", value: "Next 16" },
  { label: "Mode", value: "Cyberpunk" },
]

function openExternal(url?: string) {
  if (!url) return
  window.open(url, "_blank", "noopener,noreferrer")
}

export function ProjectsApp() {
  return (
    <div className="h-full overflow-auto bg-background/50 p-5 backdrop-blur-sm">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-linear-to-br from-cyan-400/15 via-blue-500/10 to-purple-500/10 p-5 shadow-2xl shadow-cyan-500/10"
      >
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Portfolio database
            </div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A focused view of Amir&apos;s builds, experiments and ideas. Some entries are live modules, others are roadmap concepts ready to become real projects.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:min-w-72">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border/60 bg-card/45 p-3 text-center">
                <div className="text-lg font-semibold text-cyan-300">{stat.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="mt-5 grid gap-4 lg:grid-cols-2"
      >
        {projects.map((project) => {
          const Icon = project.icon
          return (
            <motion.article
              key={project.name}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/55 p-4 shadow-lg transition-colors hover:border-cyan-400/30"
            >
              <div className={`absolute inset-0 bg-linear-to-br ${project.accent} opacity-70`} />
              <div className="relative z-10 flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/25 shadow-lg shadow-cyan-500/10">
                      <Icon className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">{project.name}</h2>
                      <span className="mt-1 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <Code2 className="h-5 w-5 text-muted-foreground transition group-hover:text-cyan-300" />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                <div className="rounded-xl border border-border/40 bg-background/35 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300">Impact</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{project.impact}</p>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span key={tech} className="rounded-full border border-border/50 bg-muted/40 px-2 py-1 text-[10px] text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
                  <button
                    type="button"
                    onClick={() => openExternal(project.repoUrl)}
                    disabled={!project.repoUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Repository
                  </button>
                  <button
                    type="button"
                    onClick={() => openExternal(project.demoUrl)}
                    disabled={!project.demoUrl}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-foreground transition hover:border-cyan-400/40 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Demo
                  </button>
                </div>
              </div>
            </motion.article>
          )
        })}
      </motion.div>
    </div>
  )
}
