"use client";

import { motion, type Variants } from "framer-motion";

interface Tool {
  name: string;
  description: string;
  category: string;
  color: string;
  icon: string;
}

const tools: Tool[] = [
  {
    name: "Claude Opus 4.7",
    description:
      "Advanced reasoning & code generation. My primary AI assistant for complex projects.",
    category: "AI Model",
    color: "from-orange-500/20 to-amber-500/20",
    icon: "brain",
  },
  {
    name: "Open Design",
    description:
      "AI-powered design tool for creating stunning visuals and interfaces.",
    category: "Design",
    color: "from-purple-500/20 to-pink-500/20",
    icon: "palette",
  },
  {
    name: "Gemini 3.1 Pro",
    description:
      "Google's multimodal powerhouse. Great for image understanding and large context.",
    category: "AI Model",
    color: "from-blue-500/20 to-cyan-500/20",
    icon: "sparkles",
  },
  {
    name: "Kimi K2.6 Pro",
    description:
      "Extended context specialist. Perfect for analyzing long documents and research.",
    category: "AI Model",
    color: "from-emerald-500/20 to-teal-500/20",
    icon: "book",
  },
  {
    name: "SuperGrok",
    description:
      "Real-time knowledge & witty responses. xAI's answer to conversational AI.",
    category: "AI Model",
    color: "from-red-500/20 to-orange-500/20",
    icon: "zap",
  },
  {
    name: "Cursor IDE",
    description: "AI-first code editor. The future of software development.",
    category: "Tools",
    color: "from-violet-500/20 to-indigo-500/20",
    icon: "code",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

function getIcon(iconName: string) {
  const iconClass = "w-6 h-6";
  switch (iconName) {
    case "brain":
      return (
        <svg
          className={`${iconClass} text-orange-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      );
    case "palette":
      return (
        <svg
          className={`${iconClass} text-purple-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      );
    case "sparkles":
      return (
        <svg
          className={`${iconClass} text-blue-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      );
    case "book":
      return (
        <svg
          className={`${iconClass} text-emerald-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case "zap":
      return (
        <svg
          className={`${iconClass} text-red-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    case "code":
      return (
        <svg
          className={`${iconClass} text-violet-400`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function StackApp() {
  return (
    <div className="h-full bg-background/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 px-6 pt-6 pb-4"
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">My Stack</h1>
        <p className="text-muted-foreground text-sm">
          The tools I use to build, create, and innovate
        </p>
      </motion.div>

      {/* Scrollable grid container */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 auto-rows-fr"
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.name}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className={`
                relative overflow-hidden rounded-lg border border-border/50
                bg-linear-to-br ${tool.color}
                backdrop-blur-xl p-4 cursor-pointer
                shadow-lg hover:shadow-cyan-500/10 hover:border-cyan-400/30
                transition-shadow duration-300
                flex flex-col
              `}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-card/40 backdrop-blur-sm pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/20">
                    {getIcon(tool.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">
                        {tool.name}
                      </h3>
                      <span className="shrink-0 px-2 py-0.5 text-[10px] rounded-full bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Neon accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400/50 to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="shrink-0 py-3 text-center text-xs text-muted-foreground border-t border-border/30"
      >
        Always exploring new tools to enhance my workflow
      </motion.div>
    </div>
  );
}
