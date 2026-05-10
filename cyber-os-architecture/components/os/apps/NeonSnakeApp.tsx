"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

const SEGMENT_COUNT = 18;
const SEGMENT_SPACING = 12;
const EASING_FACTOR = 0.08;
const DASH_SPEED_MULTIPLIER = 3;

export function NeonSnakeApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const snakeRef = useRef<Point[]>([]);
  const targetRef = useRef<Point>({ x: 200, y: 200 });
  const animationRef = useRef<number | null>(null);
  const [hue, setHue] = useState(180);
  const [isDashing, setIsDashing] = useState(false);
  const dashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailRef = useRef<{ x: number; y: number; age: number }[]>([]);

  const handleClick = useCallback(() => {
    // Change color on click
    setHue((prev) => (prev + 60) % 360);

    // Trigger dash effect
    setIsDashing(true);
    if (dashTimeoutRef.current) {
      clearTimeout(dashTimeoutRef.current);
    }
    dashTimeoutRef.current = setTimeout(() => {
      setIsDashing(false);
    }, 300);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    // Initialize snake with segments following each other
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    snakeRef.current = Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      x: centerX - i * SEGMENT_SPACING,
      y: centerY,
    }));
    targetRef.current = { x: centerX, y: centerY };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear with fade effect for trail
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const snake = snakeRef.current;
      const target = targetRef.current;
      const currentEasing = isDashing
        ? EASING_FACTOR * DASH_SPEED_MULTIPLIER
        : EASING_FACTOR;

      // Update head - follows cursor with viscous delay
      const head = snake[0];
      const dx = target.x - head.x;
      const dy = target.y - head.y;

      head.x += dx * currentEasing;
      head.y += dy * currentEasing;

      // Add to trail
      trailRef.current.push({ x: head.x, y: head.y, age: 0 });
      if (trailRef.current.length > 50) {
        trailRef.current.shift();
      }
      trailRef.current.forEach((p) => p.age++);

      // Update body segments - each follows the previous
      for (let i = 1; i < snake.length; i++) {
        const prev = snake[i - 1];
        const curr = snake[i];

        const segDx = prev.x - curr.x;
        const segDy = prev.y - curr.y;
        const dist = Math.sqrt(segDx * segDx + segDy * segDy);

        if (dist > SEGMENT_SPACING) {
          const ratio = SEGMENT_SPACING / dist;
          curr.x = prev.x - segDx * ratio;
          curr.y = prev.y - segDy * ratio;
        }
      }

      // Draw trail particles
      trailRef.current.forEach((p, i) => {
        const alpha = 1 - p.age / 50;
        if (alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${alpha * 0.3})`;
          ctx.fill();
        }
      });

      // Draw head glow
      const headGlow = ctx.createRadialGradient(
        snake[0].x,
        snake[0].y,
        0,
        snake[0].x,
        snake[0].y,
        60,
      );
      headGlow.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.4)`);
      headGlow.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(snake[0].x, snake[0].y, 60, 0, Math.PI * 2);
      ctx.fill();

      // Draw snake body with comet tail effect
      for (let i = snake.length - 1; i >= 0; i--) {
        const point = snake[i];
        const progress = 1 - i / snake.length;
        const size = 4 + progress * 12;
        const segmentHue = hue + i * 3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, size + 6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${segmentHue}, 100%, 60%, ${0.15 * progress})`;
        ctx.fill();

        // Middle glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, size + 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${segmentHue}, 100%, 65%, ${0.25 * progress})`;
        ctx.fill();

        // Body gradient
        const bodyGradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          size,
        );
        bodyGradient.addColorStop(
          0,
          `hsla(${segmentHue}, 100%, 80%, ${0.95 * progress + 0.05})`,
        );
        bodyGradient.addColorStop(
          0.5,
          `hsla(${segmentHue}, 100%, 60%, ${0.85 * progress + 0.05})`,
        );
        bodyGradient.addColorStop(
          1,
          `hsla(${segmentHue}, 100%, 45%, ${0.7 * progress + 0.05})`,
        );

        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = bodyGradient;
        ctx.fill();

        // Inner core
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * progress})`;
        ctx.fill();
      }

      // Draw dash effect particles
      if (isDashing) {
        for (let i = 0; i < 5; i++) {
          const particle = snake[Math.floor(Math.random() * snake.length)];
          const offsetX = (Math.random() - 0.5) * 30;
          const offsetY = (Math.random() - 0.5) * 30;

          ctx.beginPath();
          ctx.arc(
            particle.x + offsetX,
            particle.y + offsetY,
            Math.random() * 3 + 1,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (dashTimeoutRef.current) {
        clearTimeout(dashTimeoutRef.current);
      }
    };
  }, [hue, isDashing, handleClick]);

  return (
    <div
      ref={containerRef}
      className="h-full bg-black relative overflow-hidden"
    >
      {/* Neon border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: `inset 0 0 30px hsla(${hue}, 100%, 50%, 0.3), 0 0 30px hsla(${hue}, 100%, 50%, 0.2)`,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 border-2 transition-colors duration-300"
          style={{ borderColor: `hsla(${hue}, 100%, 50%, 0.5)` }}
        />
      </motion.div>

      <canvas ref={canvasRef} className="w-full h-full cursor-none" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
      >
        <div
          className="text-sm font-mono"
          style={{ color: `hsl(${hue}, 100%, 60%)` }}
        >
          Move mouse to guide | Click to change color & dash
        </div>
        <div
          className="px-3 py-1.5 rounded text-sm font-mono border transition-colors duration-300"
          style={{
            borderColor: `hsla(${hue}, 100%, 50%, 0.5)`,
            color: `hsl(${hue}, 100%, 60%)`,
            backgroundColor: `hsla(${hue}, 100%, 50%, 0.1)`,
          }}
        >
          VIBE MODE
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 left-4 font-mono text-lg tracking-wider transition-colors duration-300"
        style={{
          color: `hsl(${hue}, 100%, 60%)`,
          textShadow: `0 0 10px hsla(${hue}, 100%, 50%, 0.8), 0 0 20px hsla(${hue}, 100%, 50%, 0.5)`,
        }}
      >
        NEON SNAKE
      </motion.div>
    </div>
  );
}
