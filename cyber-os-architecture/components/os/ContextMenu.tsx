"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Image, Trash2, User, RefreshCw } from "lucide-react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onChangeWallpaper: () => void
  onClearConsole: () => void
  onAboutAuthor: () => void
  onRefresh: () => void
}

export function ContextMenu({
  x,
  y,
  onClose,
  onChangeWallpaper,
  onClearConsole,
  onAboutAuthor,
  onRefresh,
}: ContextMenuProps) {
  const menuItems = [
    { icon: RefreshCw, label: "Refresh", action: onRefresh },
    { icon: Image, label: "Change Wallpaper", action: onChangeWallpaper },
    { icon: Trash2, label: "Clear Console", action: onClearConsole },
    { type: "separator" as const },
    { icon: User, label: "About Author", action: onAboutAuthor },
  ]

  // Adjust position to keep menu on screen
  const adjustedX = Math.min(x, window.innerWidth - 200)
  const adjustedY = Math.min(y, window.innerHeight - 200)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.1 }}
        className="fixed z-[10000] min-w-[180px] bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-xl overflow-hidden"
        style={{ left: adjustedX, top: adjustedY }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1">
          {menuItems.map((item, index) => {
            if (item.type === "separator") {
              return (
                <div key={index} className="my-1 h-px bg-border" />
              )
            }
            
            const Icon = item.icon
            return (
              <button
                key={index}
                onClick={() => {
                  item.action()
                  onClose()
                }}
                className="w-full px-3 py-2 flex items-center gap-3 text-sm text-foreground hover:bg-muted transition-colors"
              >
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
