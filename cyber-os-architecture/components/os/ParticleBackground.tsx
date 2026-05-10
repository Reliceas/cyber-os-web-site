"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  twinkleSpeed: number
  twinkleOffset: number
}

interface MatrixChar {
  x: number
  y: number
  char: string
  speed: number
  opacity: number
}

interface ParticleBackgroundProps {
  variant?: "stars" | "matrix"
}

export function ParticleBackground({ variant = "stars" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const matrixCharsRef = useRef<MatrixChar[]>([])
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        })
      }

      particlesRef.current = particles
    }

    const createMatrixChars = () => {
      const chars: MatrixChar[] = []
      const columns = Math.floor(canvas.width / 20)
      const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

      for (let i = 0; i < columns; i++) {
        chars.push({
          x: i * 20,
          y: Math.random() * canvas.height,
          char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
          speed: Math.random() * 3 + 2,
          opacity: Math.random() * 0.5 + 0.5,
        })
      }

      matrixCharsRef.current = chars
    }

    const animateStars = (time: number) => {
      ctx.fillStyle = "rgba(10, 15, 25, 1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw gradient overlay
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7
      )
      gradient.addColorStop(0, "rgba(0, 60, 80, 0.1)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Calculate twinkle
        const twinkle = Math.sin(time * particle.twinkleSpeed + particle.twinkleOffset)
        const currentOpacity = particle.opacity * (0.5 + twinkle * 0.5)

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 220, 255, ${currentOpacity})`
        ctx.fill()

        // Draw glow for brighter particles
        if (particle.size > 1 && currentOpacity > 0.4) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(100, 220, 255, ${currentOpacity * 0.2})`
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame((t) => animateStars(t))
    }

    const animateMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = "16px monospace"
      const matrixChars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"

      matrixCharsRef.current.forEach((char) => {
        // Draw character with glow
        ctx.shadowColor = "rgba(0, 255, 100, 0.8)"
        ctx.shadowBlur = 10
        ctx.fillStyle = `rgba(0, 255, 100, ${char.opacity})`
        ctx.fillText(char.char, char.x, char.y)
        ctx.shadowBlur = 0

        // Update position
        char.y += char.speed

        // Reset when off screen
        if (char.y > canvas.height) {
          char.y = 0
          char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
          char.opacity = Math.random() * 0.5 + 0.5
        }

        // Randomly change character
        if (Math.random() < 0.01) {
          char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
        }
      })

      animationRef.current = requestAnimationFrame(animateMatrix)
    }

    resizeCanvas()

    if (variant === "matrix") {
      createMatrixChars()
      ctx.fillStyle = "black"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      animationRef.current = requestAnimationFrame(animateMatrix)
    } else {
      createParticles()
      animationRef.current = requestAnimationFrame((t) => animateStars(t))
    }

    const handleResize = () => {
      resizeCanvas()
      if (variant === "matrix") {
        createMatrixChars()
      } else {
        createParticles()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", handleResize)
    }
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
