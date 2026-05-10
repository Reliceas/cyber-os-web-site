"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

const bootLines = [
  { text: "Booting Amir's PC...", delay: 800 },
  { text: "Loading Vibe Modules [OK]", delay: 600 },
  { text: "Initializing AI Core [OK]", delay: 700 },
  { text: "Welcome, Magauiya.", delay: 1000 },
];

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const completeTimerRef = useRef<number | null>(null);

  const finishBoot = useCallback(() => {
    if (isFadingOut) return;

    setIsFadingOut(true);

    if (completeTimerRef.current) {
      window.clearTimeout(completeTimerRef.current);
    }

    completeTimerRef.current = window.setTimeout(onComplete, 500);
  }, [isFadingOut, onComplete]);

  useEffect(() => {
    return () => {
      if (completeTimerRef.current) {
        window.clearTimeout(completeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") {
        finishBoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishBoot]);

  useEffect(() => {
    if (isFadingOut) return;

    if (currentLineIndex >= bootLines.length) {
      const fadeTimer = window.setTimeout(finishBoot, 500);
      return () => window.clearTimeout(fadeTimer);
    }

    const currentLine = bootLines[currentLineIndex];
    let charIndex = 0;
    let nextLineTimer: number | null = null;

    setDisplayedText("");
    setIsTyping(true);

    const typeInterval = window.setInterval(() => {
      if (charIndex < currentLine.text.length) {
        setDisplayedText(currentLine.text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        window.clearInterval(typeInterval);
        setIsTyping(false);
        nextLineTimer = window.setTimeout(() => {
          setCurrentLineIndex((prev) => prev + 1);
        }, currentLine.delay);
      }
    }, 40);

    return () => {
      window.clearInterval(typeInterval);

      if (nextLineTimer) {
        window.clearTimeout(nextLineTimer);
      }
    };
  }, [currentLineIndex, finishBoot, isFadingOut]);

  const completedLines = bootLines.slice(0, currentLineIndex);
  const progress = Math.min(
    100,
    Math.round((currentLineIndex / bootLines.length) * 100),
  );
  const getLineColor = (text: string) => {
    if (text.includes("[OK]")) return "text-green-400";
    if (text.includes("Welcome")) return "text-cyan-400";
    return "text-cyan-300";
  };

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black flex items-center justify-center z-50 px-4"
        >
          <div className="w-full max-w-2xl">
            <div className="font-mono text-sm sm:text-lg space-y-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5 sm:p-8 shadow-2xl shadow-cyan-500/10">
              {completedLines.map((line, index) => (
                <motion.div
                  key={line.text}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={getLineColor(line.text)}
                >
                  <span className="text-cyan-500 mr-2">{">"}</span>
                  {line.text}
                </motion.div>
              ))}

              {currentLineIndex < bootLines.length && (
                <div className={getLineColor(bootLines[currentLineIndex].text)}>
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

              <div className="pt-4">
                <div className="h-1.5 w-full rounded-full bg-cyan-400/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.25 }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] sm:text-xs text-cyan-200/60">
                  <span>CyberOS boot loader</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={finishBoot}
            className="absolute bottom-5 right-5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200 backdrop-blur hover:bg-cyan-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Skip boot sequence"
          >
            Skip boot{" "}
            <span className="hidden sm:inline text-cyan-200/60">
              Enter / Esc
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
