"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Cpu, Activity } from "lucide-react"

interface WidgetProps {
  vibeLevel: number
}

export function SystemLoadWidget() {
  const [cpuData, setCpuData] = useState<number[]>(Array(20).fill(30))
  const [ramData, setRamData] = useState<number[]>(Array(20).fill(45))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData((prev) => {
        const newData = [...prev.slice(1)]
        // Simulate CPU usage fluctuation
        const lastValue = prev[prev.length - 1]
        const change = (Math.random() - 0.5) * 30
        const newValue = Math.max(10, Math.min(95, lastValue + change))
        newData.push(newValue)
        return newData
      })
      
      setRamData((prev) => {
        const newData = [...prev.slice(1)]
        const lastValue = prev[prev.length - 1]
        const change = (Math.random() - 0.5) * 15
        const newValue = Math.max(30, Math.min(85, lastValue + change))
        newData.push(newValue)
        return newData
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 140
    canvas.height = 60

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw CPU line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(0, 255, 255, 0.8)"
    ctx.lineWidth = 1.5
    cpuData.forEach((value, i) => {
      const x = (i / (cpuData.length - 1)) * canvas.width
      const y = canvas.height - (value / 100) * canvas.height
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // CPU glow
    ctx.strokeStyle = "rgba(0, 255, 255, 0.3)"
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw RAM line
    ctx.beginPath()
    ctx.strokeStyle = "rgba(139, 92, 246, 0.8)"
    ctx.lineWidth = 1.5
    ramData.forEach((value, i) => {
      const x = (i / (ramData.length - 1)) * canvas.width
      const y = canvas.height - (value / 100) * canvas.height
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // RAM glow
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)"
    ctx.lineWidth = 4
    ctx.stroke()
  }, [cpuData, ramData])

  const currentCpu = cpuData[cpuData.length - 1]
  const currentRam = ramData[ramData.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-44 bg-card/60 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-medium text-foreground">System Load</span>
      </div>
      
      <canvas ref={canvasRef} className="w-full h-15 mb-2" />
      
      <div className="flex justify-between text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-muted-foreground">CPU</span>
          <span className="text-cyan-400 font-mono">{currentCpu.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-muted-foreground">RAM</span>
          <span className="text-purple-400 font-mono">{currentRam.toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export function VibeLevelWidget({ vibeLevel }: WidgetProps) {
  const [displayLevel, setDisplayLevel] = useState(0)

  useEffect(() => {
    // Animate the vibe level
    const targetLevel = vibeLevel
    const step = (targetLevel - displayLevel) * 0.1
    if (Math.abs(step) > 0.5) {
      const timeout = setTimeout(() => {
        setDisplayLevel((prev) => prev + step)
      }, 50)
      return () => clearTimeout(timeout)
    } else {
      setDisplayLevel(targetLevel)
    }
  }, [vibeLevel, displayLevel])

  const getVibeColor = () => {
    if (displayLevel < 30) return "from-gray-500 to-gray-400"
    if (displayLevel < 60) return "from-blue-500 to-cyan-400"
    if (displayLevel < 85) return "from-cyan-400 to-green-400"
    return "from-green-400 to-yellow-400"
  }

  const getVibeText = () => {
    if (displayLevel < 30) return "Warming Up..."
    if (displayLevel < 60) return "Getting There"
    if (displayLevel < 85) return "Vibing Hard"
    return "MAX VIBE!"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="w-44 bg-card/60 backdrop-blur-md border border-border/50 rounded-lg p-3 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-medium text-foreground">Vibe Level</span>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-2">
        <motion.div
          className={`h-full bg-gradient-to-r ${getVibeColor()} rounded-full`}
          style={{ width: `${displayLevel}%` }}
          animate={{ 
            boxShadow: displayLevel > 60 
              ? "0 0 10px rgba(0, 255, 255, 0.5)" 
              : "none"
          }}
        />
        {displayLevel > 85 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground">{getVibeText()}</span>
        <span className="text-xs font-mono text-cyan-400">{displayLevel.toFixed(0)}%</span>
      </div>
    </motion.div>
  )
}
