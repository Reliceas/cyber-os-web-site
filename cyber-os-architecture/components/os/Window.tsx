"use client"

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react"
import { X, Minus, Square, Copy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWindows } from "./WindowContext"
import type { WindowState, SnapZone } from "./types"

interface WindowProps {
  window: WindowState
  children: ReactNode
}

export function Window({ window, children }: WindowProps) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    windows,
  } = useWindows()

  const windowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeDirection, setResizeDirection] = useState("")
  const [snapZone, setSnapZone] = useState<SnapZone>({ zone: null, preview: null })
  const [preMaximizeState, setPreMaximizeState] = useState<{ position: { x: number; y: number }; size: { width: number; height: number } } | null>(null)

  const isActive = windows.length > 0 && windows.reduce((max, w) => w.zIndex > max.zIndex ? w : max).id === window.id

  const getSnapZone = useCallback((x: number, y: number): SnapZone => {
    const threshold = 20
    const screenWidth = globalThis.innerWidth
    const screenHeight = globalThis.innerHeight - 48

    if (y < threshold) {
      if (x < threshold) {
        return {
          zone: "top-left",
          preview: { x: 0, y: 0, width: screenWidth / 2, height: screenHeight / 2 },
        }
      }
      if (x > screenWidth - threshold) {
        return {
          zone: "top-right",
          preview: { x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight / 2 },
        }
      }
      return {
        zone: "maximize",
        preview: { x: 0, y: 0, width: screenWidth, height: screenHeight },
      }
    }

    if (y > screenHeight - threshold + 48) {
      if (x < threshold) {
        return {
          zone: "bottom-left",
          preview: { x: 0, y: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 },
        }
      }
      if (x > screenWidth - threshold) {
        return {
          zone: "bottom-right",
          preview: { x: screenWidth / 2, y: screenHeight / 2, width: screenWidth / 2, height: screenHeight / 2 },
        }
      }
    }

    if (x < threshold) {
      return {
        zone: "left",
        preview: { x: 0, y: 0, width: screenWidth / 2, height: screenHeight },
      }
    }

    if (x > screenWidth - threshold) {
      return {
        zone: "right",
        preview: { x: screenWidth / 2, y: 0, width: screenWidth / 2, height: screenHeight },
      }
    }

    return { zone: null, preview: null }
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".window-controls")) return
      
      focusWindow(window.id)
      
      if (window.isMaximized) return
      
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y,
      })
    },
    [window.id, window.isMaximized, window.position, focusWindow]
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.stopPropagation()
      focusWindow(window.id)
      setIsResizing(true)
      setResizeDirection(direction)
    },
    [window.id, focusWindow]
  )

  useEffect(() => {
    if (!isDragging && !isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = Math.max(0, e.clientY - dragOffset.y)
        updateWindowPosition(window.id, { x: newX, y: newY })
        setSnapZone(getSnapZone(e.clientX, e.clientY))
      }

      if (isResizing) {
        const rect = windowRef.current?.getBoundingClientRect()
        if (!rect) return

        let newWidth = window.size.width
        let newHeight = window.size.height
        let newX = window.position.x
        let newY = window.position.y

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(300, e.clientX - window.position.x)
        }
        if (resizeDirection.includes("w")) {
          const delta = window.position.x - e.clientX
          newWidth = Math.max(300, window.size.width + delta)
          if (newWidth > 300) newX = e.clientX
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(200, e.clientY - window.position.y)
        }
        if (resizeDirection.includes("n")) {
          const delta = window.position.y - e.clientY
          newHeight = Math.max(200, window.size.height + delta)
          if (newHeight > 200) newY = Math.max(0, e.clientY)
        }

        updateWindowSize(window.id, { width: newWidth, height: newHeight })
        updateWindowPosition(window.id, { x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      if (isDragging && snapZone.zone && snapZone.preview) {
        if (!preMaximizeState) {
          setPreMaximizeState({ position: window.position, size: window.size })
        }
        if (snapZone.zone === "maximize") {
          maximizeWindow(window.id)
        } else {
          updateWindowPosition(window.id, { x: snapZone.preview.x, y: snapZone.preview.y })
          updateWindowSize(window.id, { width: snapZone.preview.width, height: snapZone.preview.height })
        }
      }
      setIsDragging(false)
      setIsResizing(false)
      setSnapZone({ zone: null, preview: null })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, window, resizeDirection, snapZone, preMaximizeState, updateWindowPosition, updateWindowSize, maximizeWindow, getSnapZone])

  const handleDoubleClick = useCallback(() => {
    if (window.isMaximized) {
      if (preMaximizeState) {
        updateWindowPosition(window.id, preMaximizeState.position)
        updateWindowSize(window.id, preMaximizeState.size)
        setPreMaximizeState(null)
      }
      restoreWindow(window.id)
    } else {
      setPreMaximizeState({ position: window.position, size: window.size })
      maximizeWindow(window.id)
    }
  }, [window.id, window.isMaximized, preMaximizeState, restoreWindow, maximizeWindow, updateWindowPosition, updateWindowSize])

  const windowStyle = window.isMaximized
    ? {
        top: 0,
        left: 0,
        width: "100%",
        height: "calc(100vh - 48px)",
        zIndex: window.zIndex,
      }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
      }

  return (
    <AnimatePresence>
      {!window.isMinimized && (
        <>
          {snapZone.preview && isDragging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bg-cyan-500/20 border-2 border-cyan-500/50 rounded-sm pointer-events-none"
              style={{
                top: snapZone.preview.y,
                left: snapZone.preview.x,
                width: snapZone.preview.width,
                height: snapZone.preview.height,
                zIndex: 9999,
              }}
            />
          )}
          <motion.div
            ref={windowRef}
            layoutId={`window-${window.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: isActive 
                ? "0 0 0 1px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.5)" 
                : "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9, 
              y: 50,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              boxShadow: { duration: 0.3 }
            }}
            className={`fixed flex flex-col bg-card/90 backdrop-blur-xl border overflow-hidden ${
              isActive ? "border-cyan-500/30" : "border-border"
            }`}
            style={windowStyle}
            onClick={() => focusWindow(window.id)}
          >
            {/* Active Window Glow */}
            {isActive && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  boxShadow: "inset 0 0 30px rgba(0, 255, 255, 0.1)",
                }}
              />
            )}

            {/* Title Bar */}
            <div
              className={`flex items-center justify-between h-9 px-3 border-b border-border cursor-move select-none ${
                isActive ? "bg-secondary/70" : "bg-secondary/40"
              }`}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
            >
              <span className="text-sm font-medium text-foreground truncate">{window.title}</span>
              <div className="window-controls flex items-center gap-1">
                <button
                  onClick={() => minimizeWindow(window.id)}
                  className="p-1.5 hover:bg-muted rounded-sm transition-colors"
                  aria-label="Minimize"
                >
                  <Minus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={handleDoubleClick}
                  className="p-1.5 hover:bg-muted rounded-sm transition-colors"
                  aria-label={window.isMaximized ? "Restore" : "Maximize"}
                >
                  {window.isMaximized ? (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <Square className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => closeWindow(window.id)}
                  className="p-1.5 hover:bg-destructive hover:text-destructive-foreground rounded-sm transition-colors"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">{children}</div>

            {/* Resize Handles */}
            {!window.isMaximized && (
              <>
                <div
                  className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize"
                  onMouseDown={(e) => handleResizeStart(e, "nw")}
                />
                <div
                  className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize"
                  onMouseDown={(e) => handleResizeStart(e, "ne")}
                />
                <div
                  className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize"
                  onMouseDown={(e) => handleResizeStart(e, "sw")}
                />
                <div
                  className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize"
                  onMouseDown={(e) => handleResizeStart(e, "se")}
                />
                <div
                  className="absolute top-0 left-2 right-2 h-1 cursor-n-resize"
                  onMouseDown={(e) => handleResizeStart(e, "n")}
                />
                <div
                  className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize"
                  onMouseDown={(e) => handleResizeStart(e, "s")}
                />
                <div
                  className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize"
                  onMouseDown={(e) => handleResizeStart(e, "w")}
                />
                <div
                  className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize"
                  onMouseDown={(e) => handleResizeStart(e, "e")}
                />
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
