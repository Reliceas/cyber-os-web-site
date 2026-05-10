"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface MatrixChar {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
}

interface ParticleBackgroundProps {
  variant?: "stars" | "matrix";
}

const matrixCharacters =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

export function ParticleBackground({
  variant = "stars",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const matrixCharsRef = useRef<MatrixChar[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const stopAnimation = () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current);
      }
    };

    const drawStaticBackground = () => {
      ctx.fillStyle = variant === "matrix" ? "#000" : "#0a0f19";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7,
      );
      gradient.addColorStop(
        0,
        variant === "matrix"
          ? "rgba(0, 255, 100, 0.12)"
          : "rgba(0, 180, 220, 0.14)",
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const isSmallScreen = canvas.width < 768;
      const particleCount = Math.min(
        isSmallScreen ? 70 : 180,
        Math.max(
          24,
          Math.floor(
            (canvas.width * canvas.height) / (isSmallScreen ? 12000 : 8000),
          ),
        ),
      );

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
        });
      }

      particlesRef.current = particles;
    };

    const createMatrixChars = () => {
      const chars: MatrixChar[] = [];
      const columnWidth = canvas.width < 768 ? 28 : 20;
      const columns = Math.floor(canvas.width / columnWidth);

      for (let i = 0; i < columns; i++) {
        chars.push({
          x: i * columnWidth,
          y: Math.random() * canvas.height,
          char: matrixCharacters[
            Math.floor(Math.random() * matrixCharacters.length)
          ],
          speed: Math.random() * 2.5 + 1.5,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }

      matrixCharsRef.current = chars;
    };

    const animateStars = (time: number) => {
      ctx.fillStyle = "rgba(10, 15, 25, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.7,
      );
      gradient.addColorStop(0, "rgba(0, 60, 80, 0.1)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        const twinkle = Math.sin(
          time * particle.twinkleSpeed + particle.twinkleOffset,
        );
        const currentOpacity = particle.opacity * (0.5 + twinkle * 0.5);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 220, 255, ${currentOpacity})`;
        ctx.fill();

        if (particle.size > 1 && currentOpacity > 0.4) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 220, 255, ${currentOpacity * 0.2})`;
          ctx.fill();
        }
      });

      animationRef.current = window.requestAnimationFrame((nextTime) =>
        animateStars(nextTime),
      );
    };

    const animateMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = canvas.width < 768 ? "14px monospace" : "16px monospace";

      matrixCharsRef.current.forEach((char) => {
        ctx.shadowColor = "rgba(0, 255, 100, 0.8)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(0, 255, 100, ${char.opacity})`;
        ctx.fillText(char.char, char.x, char.y);
        ctx.shadowBlur = 0;

        char.y += char.speed;

        if (char.y > canvas.height) {
          char.y = 0;
          char.char =
            matrixCharacters[
              Math.floor(Math.random() * matrixCharacters.length)
            ];
          char.opacity = Math.random() * 0.5 + 0.5;
        }

        if (Math.random() < 0.01) {
          char.char =
            matrixCharacters[
              Math.floor(Math.random() * matrixCharacters.length)
            ];
        }
      });

      animationRef.current = window.requestAnimationFrame(animateMatrix);
    };

    const setupScene = () => {
      stopAnimation();
      resizeCanvas();

      if (motionPreference.matches) {
        drawStaticBackground();
        return;
      }

      if (variant === "matrix") {
        createMatrixChars();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        animationRef.current = window.requestAnimationFrame(animateMatrix);
      } else {
        createParticles();
        animationRef.current = window.requestAnimationFrame((time) =>
          animateStars(time),
        );
      }
    };

    setupScene();

    window.addEventListener("resize", setupScene);
    motionPreference.addEventListener("change", setupScene);

    return () => {
      stopAnimation();
      window.removeEventListener("resize", setupScene);
      motionPreference.removeEventListener("change", setupScene);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
