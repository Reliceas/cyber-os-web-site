"use client"

import { useState, useEffect } from "react"
import { Terminal, Folder, Globe, Settings, FileText, Music, Gamepad2, Layers, User } from "lucide-react"
import { useWindows } from "./WindowContext"
import type { AppId } from "./types"

const apps: { id: AppId; icon: typeof Terminal; label: string }[] = [
  { id: "terminal", icon: Terminal, label: "Terminal" },
  { id: "files", icon: Folder, label: "Files" },
  { id: "browser", icon: Globe, label: "Browser" },
  { id: "snake", icon: Gamepad2, label: "Neon Snake" },
  { id: "stack", icon: Layers, label: "My Stack" },
  { id: "about", icon: User, label: "About" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "notes", icon: FileText, label: "Notes" },
  { id: "music", icon: Music, label: "Music" },
]

export function Taskbar() {
  const { windows, openApp, focusWindow } = useWindows()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleAppClick = (appId: AppId) => {
    const existingWindow = windows.find((w) => w.component === appId)
    if (existingWindow) {
      focusWindow(existingWindow.id)
    } else {
      openApp(appId)
    }
  }

  const isAppOpen = (appId: AppId) => {
    return windows.some((w) => w.component === appId && !w.isMinimized)
  }

  const isAppMinimized = (appId: AppId) => {
    return windows.some((w) => w.component === appId && w.isMinimized)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-card/80 backdrop-blur-xl border-t border-border flex items-center justify-center z-[9999]">
      {/* Start Button */}
      <div className="absolute left-3 flex items-center gap-2">
        <button className="p-2 hover:bg-muted rounded-sm transition-colors">
          <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
            <div className="bg-cyan-400 rounded-sm" />
            <div className="bg-cyan-400 rounded-sm" />
            <div className="bg-cyan-400 rounded-sm" />
            <div className="bg-cyan-400 rounded-sm" />
          </div>
        </button>
      </div>

      {/* Centered App Icons */}
      <div className="flex items-center gap-1 px-2 py-1 bg-secondary/30 rounded-sm">
        {apps.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => handleAppClick(id)}
            className={`
              relative p-2.5 rounded-sm transition-all duration-150
              ${isAppOpen(id) || isAppMinimized(id) ? "bg-muted" : "hover:bg-muted/50"}
            `}
            title={label}
          >
            <Icon className={`w-5 h-5 ${isAppOpen(id) ? "text-cyan-400" : "text-foreground"}`} />
            {(isAppOpen(id) || isAppMinimized(id)) && (
              <div
                className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all ${
                  isAppOpen(id) ? "w-4 bg-cyan-400" : "w-1.5 bg-muted-foreground"
                }`}
              />
            )}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="absolute right-3 flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-xs">ENG</span>
          <div className="w-px h-4 bg-border" />
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-foreground">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-xs">
            {time.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  )
}
