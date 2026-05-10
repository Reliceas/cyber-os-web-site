"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const skills = [
  { name: "AI/ML Integration", level: 90, color: "cyan" },
  { name: "Vibe Coding", level: 95, color: "purple" },
  { name: "Prompt Engineering", level: 88, color: "blue" },
  { name: "Web Development", level: 85, color: "green" },
  { name: "UI/UX Design", level: 80, color: "pink" },
  { name: "Problem Solving", level: 92, color: "yellow" },
]

const techStack = [
  { name: "Claude Opus 4.7", description: "Primary AI Assistant", icon: "C", color: "#E3A14B" },
  { name: "Gemini 3.1 Pro", description: "Multimodal Tasks", icon: "G", color: "#4285F4" },
  { name: "Kimi K2.6 Pro", description: "Long Context Research", icon: "K", color: "#FF6B6B" },
  { name: "SuperGrok", description: "Real-time Analysis", icon: "X", color: "#1DA1F2" },
  { name: "Open Design", description: "UI/UX Workflows", icon: "O", color: "#00DC82" },
]

const projects = [
  {
    name: "CyberOS",
    description: "A simulated operating system with draggable windows and multiple apps",
    tech: ["Next.js", "TypeScript", "Framer Motion"],
  },
  {
    name: "AI Research Hub",
    description: "Comparing and analyzing different AI models for various tasks",
    tech: ["Claude", "Gemini", "Kimi"],
  },
  {
    name: "Game Optimization Scripts",
    description: "Registry tweaks and system optimizations for better gaming performance",
    tech: ["PowerShell", "Windows API"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
}

function SkillBadge({ name, level, color }: { name: string; level: number; color: string }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const colorMap: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "0 0 20px rgba(0, 255, 255, 0.5)" },
    purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "0 0 20px rgba(147, 51, 234, 0.5)" },
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "0 0 20px rgba(59, 130, 246, 0.5)" },
    green: { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400", glow: "0 0 20px rgba(34, 197, 94, 0.5)" },
    pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", glow: "0 0 20px rgba(236, 72, 153, 0.5)" },
    yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "0 0 20px rgba(234, 179, 8, 0.5)" },
  }
  
  const colors = colorMap[color] || colorMap.cyan

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <motion.div
        animate={{ boxShadow: isHovered ? colors.glow : "none" }}
        transition={{ duration: 0.2 }}
        className={`p-3 rounded-lg border ${colors.bg} ${colors.border} transition-colors`}
      >
        <div className="flex justify-between text-sm mb-2">
          <span className={`font-medium ${colors.text}`}>{name}</span>
          <span className="text-muted-foreground font-mono">{level}%</span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${colors.text.replace("text", "bg")}`}
            style={{
              boxShadow: isHovered ? colors.glow : "none",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

function TechBadge({ name, description, icon, color }: { name: string; description: string; icon: string; color: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, y: -2 }}
      animate={{ 
        boxShadow: isHovered ? `0 0 25px ${color}40, 0 0 50px ${color}20` : "none"
      }}
      className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 cursor-pointer transition-colors hover:border-opacity-50"
      style={{ borderColor: isHovered ? color : undefined }}
    >
      <motion.div
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          boxShadow: isHovered ? `0 0 15px ${color}` : "none"
        }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-foreground truncate">{name}</div>
        <div className="text-xs text-muted-foreground truncate">{description}</div>
      </div>
    </motion.div>
  )
}

export function AboutApp() {
  return (
    <div className="h-full bg-background/50 backdrop-blur-sm overflow-auto">
      {/* Header */}
      <div className="relative h-36 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAzMCBoNjAgTTMwIDAgdjYwIiBzdHJva2U9InJnYmEoMCwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50" />
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400/30"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-4 left-6 flex items-end gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-black shadow-lg shadow-cyan-500/30"
          >
            MA
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Magauiya Amir</h1>
            <p className="text-sm text-cyan-400">15 y.o. Vibe Coder from Kazakhstan</p>
          </div>
        </motion.div>
      </div>

      <div className="p-6 space-y-6">
        {/* Bio */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4"
        >
          <h2 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            About Me
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            I&apos;m a young developer passionate about AI, creative coding, and building cool stuff. 
            I love exploring new technologies, especially AI models like Claude, Gemini, and Kimi. 
            My approach is &quot;Vibe Coding&quot; - writing code that feels right and looks amazing.
          </p>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4"
        >
          <h2 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {techStack.map((tech, index) => (
              <motion.div key={tech.name} variants={itemVariants}>
                <TechBadge {...tech} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4"
        >
          <h2 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Skills
          </h2>
          <div className="space-y-2">
            {skills.map((skill) => (
              <motion.div key={skill.name} variants={itemVariants}>
                <SkillBadge {...skill} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 p-4"
        >
          <h2 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <motion.div
                key={project.name}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 4 }}
                className="p-3 bg-muted/30 rounded-lg border border-border/30 hover:border-cyan-400/30 transition-all cursor-pointer"
              >
                <h3 className="font-medium text-foreground text-sm">{project.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {project.tech.map((tech) => (
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.1 }}
                      className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 cursor-pointer hover:bg-cyan-400/20 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground py-4"
        >
          <p>Open to collaborations and cool projects</p>
          <div className="flex justify-center gap-4 mt-3">
            {["GitHub", "Telegram", "Discord"].map((platform) => (
              <motion.span
                key={platform}
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-cyan-400 hover:text-cyan-300 cursor-pointer px-3 py-1 rounded-full border border-cyan-400/20 hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all"
              >
                {platform}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
