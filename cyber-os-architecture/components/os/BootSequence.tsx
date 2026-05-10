"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BootSequenceProps {
  onComplete: () => void
}

const bootLines = [
  { text: "Booting Amir's PC...", delay: 800 },
  { text: "Loading Vibe Modules [OK]", delay: 600 },
  { text: "Initializing AI Core [OK]", delay: 700 },
  { text: "Welcome, Magauiya.", delay: 1000 },
]

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (currentLineIndex >= bootLines.length) {
      // All lines done, start fade out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true)
        setTimeout(onComplete, 800)
      }, 500)
      return () => clearTimeout(fadeTimer)
    }

    const currentLine = bootLines[currentLineIndex]
    let charIndex = 0
    setDisplayedText("")
    setIsTyping(true)

    // Typewriter effect
    const typeInterval = setInterval(() => {
      if (charIndex < currentLine.text.length) {
        setDisplayedText(currentLine.text.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        // Move to next line after delay
        setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1)
        }, currentLine.delay)
      }
    }, 40) // Typing speed

    return () => clearInterval(typeInterval)
  }, [currentLineIndex, onComplete])

  const completedLines = bootLines.slice(0, currentLineIndex)

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
        >
          <div className="font-mono text-lg space-y-2">
            {/* Completed lines */}
            {completedLines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${
                  line.text.includes("[OK]")
                    ? "text-green-400"
                    : line.text.includes("Welcome")
                    ? "text-cyan-400"
                    : "text-cyan-300"
                }`}
              >
                <span className="text-cyan-500 mr-2">{">"}</span>
                {line.text}
              </motion.div>
            ))}

            {/* Currently typing line */}
            {currentLineIndex < bootLines.length && (
              <div
                className={`${
                  bootLines[currentLineIndex].text.includes("[OK]")
                    ? "text-green-400"
                    : bootLines[currentLineIndex].text.includes("Welcome")
                    ? "text-cyan-400"
                    : "text-cyan-300"
                }`}
              >
                <span className="text-cyan-500 mr-2">{">"}</span>
                {displayedText}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-3 h-5 bg-cyan-400 ml-0.5 align-middle"
                  />
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
