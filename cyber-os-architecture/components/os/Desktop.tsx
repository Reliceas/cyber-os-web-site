"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { WindowProvider, useWindows } from "./WindowContext"
import { Window } from "./Window"
import { Taskbar } from "./Taskbar"
import { ParticleBackground } from "./ParticleBackground"
import { SystemLoadWidget, VibeLevelWidget } from "./DesktopWidgets"
import { ContextMenu } from "./ContextMenu"
import { TerminalApp } from "./apps/TerminalApp"
import { FilesApp } from "./apps/FilesApp"
import { BrowserApp } from "./apps/BrowserApp"
import { SettingsApp } from "./apps/SettingsApp"
import { NotesApp } from "./apps/NotesApp"
import { MusicApp } from "./apps/MusicApp"
import { NeonSnakeApp } from "./apps/NeonSnakeApp"
import { StackApp } from "./apps/StackApp"
import { AboutApp } from "./apps/AboutApp"
import type { AppId } from "./types"

const wallpapers = ["default", "matrix", "gradient-blue"] as const
type Wallpaper = (typeof wallpapers)[number]

function DesktopContent() {
  const { windows, openApp, focusWindow } = useWindows()
  const [vibeLevel, setVibeLevel] = useState(25)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [wallpaper, setWallpaper] = useState<Wallpaper>("default")
  const [lastActivity, setLastActivity] = useState(Date.now())

  // Load wallpaper from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWallpaper = localStorage.getItem("cyber-os-wallpaper") as Wallpaper | null
      if (savedWallpaper && wallpapers.includes(savedWallpaper)) {
        setWallpaper(savedWallpaper)
      }
    }
  }, [])

  // Track activity for vibe level
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now())
      setVibeLevel((prev) => Math.min(100, prev + 2))
    }

    window.addEventListener("mousemove", handleActivity)
    window.addEventListener("keydown", handleActivity)
    window.addEventListener("click", handleActivity)

    const decayInterval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity
      if (timeSinceActivity > 3000) {
        setVibeLevel((prev) => Math.max(0, prev - 1))
      }
    }, 500)

    return () => {
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("click", handleActivity)
      clearInterval(decayInterval)
    }
  }, [lastActivity])

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const handleWallpaperChange = useCallback((newWallpaper: string) => {
    if (wallpapers.includes(newWallpaper as Wallpaper)) {
      setWallpaper(newWallpaper as Wallpaper)
      localStorage.setItem("cyber-os-wallpaper", newWallpaper)
    }
  }, [])

  const cycleWallpaper = useCallback(() => {
    const currentIndex = wallpapers.indexOf(wallpaper)
    const nextWallpaper = wallpapers[(currentIndex + 1) % wallpapers.length]
    handleWallpaperChange(nextWallpaper)
  }, [wallpaper, handleWallpaperChange])

  const getWallpaperStyle = () => {
    switch (wallpaper) {
      case "matrix":
        return "bg-black"
      case "gradient-blue":
        return "bg-gradient-to-br from-blue-900/50 via-background to-teal-900/50"
      default:
        return "bg-background"
    }
  }

  const renderAppComponent = (component: string) => {
    switch (component) {
      case "terminal":
        return <TerminalApp />
      case "files":
        return <FilesApp />
      case "browser":
        return <BrowserApp />
      case "settings":
        return (
          <SettingsApp
            onWallpaperChange={handleWallpaperChange}
            currentWallpaper={wallpaper}
          />
        )
      case "notes":
        return <NotesApp />
      case "music":
        return <MusicApp />
      case "snake":
        return <NeonSnakeApp />
      case "stack":
        return <StackApp />
      case "about":
        return <AboutApp />
      default:
        return null
    }
  }

  return (
    <div
      className={`relative w-full h-screen overflow-hidden transition-colors duration-500 ${getWallpaperStyle()}`}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      <ParticleBackground variant={wallpaper === "matrix" ? "matrix" : "stars"} />

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 grid gap-2" style={{ zIndex: 1 }}>
        <DesktopIcon id="terminal" icon="terminal" label="Terminal" />
        <DesktopIcon id="files" icon="folder" label="Files" />
        <DesktopIcon id="browser" icon="globe" label="Browser" />
        <DesktopIcon id="snake" icon="gamepad" label="Neon Snake" />
        <DesktopIcon id="stack" icon="layers" label="My Stack" />
        <DesktopIcon id="about" icon="user" label="About" />
      </div>

      {/* Desktop Widgets */}
      <div className="absolute top-4 right-4 flex flex-col gap-3" style={{ zIndex: 1 }}>
        <SystemLoadWidget />
        <VibeLevelWidget vibeLevel={vibeLevel} />
      </div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((window) => (
          <Window key={window.id} window={window}>
            {renderAppComponent(window.component)}
          </Window>
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onChangeWallpaper={cycleWallpaper}
          onClearConsole={() => {}}
          onAboutAuthor={() => openApp("about")}
          onRefresh={() => window.location.reload()}
        />
      )}

      <Taskbar />
    </div>
  )
}

function DesktopIcon({ id, icon, label }: { id: AppId; icon: string; label: string }) {
  const { openApp } = useWindows()

  const handleDoubleClick = () => {
    openApp(id)
  }

  const getIcon = () => {
    switch (icon) {
      case "terminal":
        return (
          <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case "folder":
        return (
          <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2h-8l-2-2z" />
          </svg>
        )
      case "globe":
        return (
          <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      case "gamepad":
        return (
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        )
      case "layers":
        return (
          <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      case "user":
        return (
          <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <motion.button
      onDoubleClick={handleDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors w-20"
    >
      <motion.div
        className="w-12 h-12 flex items-center justify-center"
        whileHover={{
          filter: "drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))",
        }}
      >
        {getIcon()}
      </motion.div>
      <span className="text-xs text-white text-center drop-shadow-lg">{label}</span>
    </motion.button>
  )
}

export function Desktop() {
  return (
    <WindowProvider>
      <DesktopContent />
    </WindowProvider>
  )
}
