"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Terminal,
  Folder,
  Globe,
  Settings,
  FileText,
  Music,
  Gamepad2,
  Layers,
  User,
  Search,
  Sparkles,
  Power,
  type LucideIcon,
} from "lucide-react";
import { useWindows } from "./WindowContext";
import type { AppId } from "./types";

const apps: {
  id: AppId;
  icon: LucideIcon;
  label: string;
  description: string;
}[] = [
  {
    id: "terminal",
    icon: Terminal,
    label: "Terminal",
    description: "Run CyberOS commands",
  },
  {
    id: "files",
    icon: Folder,
    label: "Files",
    description: "Browse simulated files",
  },
  {
    id: "browser",
    icon: Globe,
    label: "Browser",
    description: "Open safe embedded sites",
  },
  {
    id: "snake",
    icon: Gamepad2,
    label: "Neon Snake",
    description: "Play the arcade mini-game",
  },
  {
    id: "stack",
    icon: Layers,
    label: "My Stack",
    description: "Explore tools and workflow",
  },
  { id: "about", icon: User, label: "About", description: "Meet the creator" },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
    description: "Customize CyberOS",
  },
  {
    id: "notes",
    icon: FileText,
    label: "Notes",
    description: "Write local notes",
  },
  {
    id: "music",
    icon: Music,
    label: "Music",
    description: "Open the music player",
  },
];

export function Taskbar() {
  const { windows, openApp, focusWindow } = useWindows();
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsStartOpen(false);
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsStartOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredApps = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return apps;
    }

    return apps.filter((app) =>
      `${app.label} ${app.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery]);

  const handleAppClick = (appId: AppId) => {
    const existingWindow = windows.find((w) => w.component === appId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
    } else {
      openApp(appId);
    }

    setIsStartOpen(false);
  };

  const isAppOpen = (appId: AppId) => {
    return windows.some((w) => w.component === appId && !w.isMinimized);
  };

  const isAppMinimized = (appId: AppId) => {
    return windows.some((w) => w.component === appId && w.isMinimized);
  };

  return (
    <>
      <AnimatePresence>
        {isStartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="fixed bottom-14 left-3 z-9998 w-[min(28rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl sm:bottom-14"
          >
            <div className="border-b border-border/70 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-black shadow-lg shadow-cyan-400/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    CyberOS Start
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Search apps or open your portfolio modules
                  </div>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search apps... Ctrl + K"
                  className="w-full rounded-lg border border-border bg-muted/60 py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-cyan-400/50"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filteredApps.map(({ id, icon: Icon, label, description }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleAppClick(id)}
                    className="group flex items-center gap-3 rounded-xl border border-transparent p-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-cyan-400/15">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {label}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {filteredApps.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No apps found
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
              <span>
                {windows.length} window{windows.length === 1 ? "" : "s"} open
              </span>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Power className="h-3.5 w-3.5" />
                Restart UI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-9999 flex h-14 items-center justify-center border-t border-border bg-card/80 backdrop-blur-xl sm:h-12">
        <div className="absolute left-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStartOpen((open) => !open)}
            className={`rounded-sm p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isStartOpen ? "bg-cyan-400/20" : "hover:bg-muted"
            }`}
            aria-label="Open Start menu"
            aria-expanded={isStartOpen}
          >
            <div className="grid h-5 w-5 grid-cols-2 gap-0.5">
              <div className="rounded-sm bg-cyan-400" />
              <div className="rounded-sm bg-cyan-400" />
              <div className="rounded-sm bg-cyan-400" />
              <div className="rounded-sm bg-cyan-400" />
            </div>
          </button>
        </div>

        <div className="flex max-w-[58vw] items-center gap-1 overflow-x-auto rounded-sm bg-secondary/30 px-2 py-1 sm:max-w-none">
          {apps.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleAppClick(id)}
              className={`
                relative rounded-sm p-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
                ${isAppOpen(id) || isAppMinimized(id) ? "bg-muted" : "hover:bg-muted/50"}
              `}
              title={label}
              aria-label={`Open ${label}`}
            >
              <Icon
                className={`h-5 w-5 ${isAppOpen(id) ? "text-cyan-400" : "text-foreground"}`}
              />
              {(isAppOpen(id) || isAppMinimized(id)) && (
                <div
                  className={`absolute bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all ${
                    isAppOpen(id)
                      ? "w-4 bg-cyan-400"
                      : "w-1.5 bg-muted-foreground"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        <div className="absolute right-3 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs">ENG</span>
            <div className="h-4 w-px bg-border" />
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-foreground">
              {time.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="hidden text-xs sm:block">
              {time.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
