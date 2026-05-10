"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useWindows } from "../WindowContext";
import type { AppId } from "../types";

interface CommandOutput {
  command: string;
  output: string[];
  isError?: boolean;
  isAnimated?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  char: string;
}

const fileSystem: Record<string, string[]> = {
  "~": ["documents", "downloads", "projects", "readme.txt"],
  "~/documents": ["notes.txt", "resume.pdf", "ideas.md"],
  "~/downloads": ["image.png", "setup.exe", "archive.zip"],
  "~/projects": ["portfolio", "cyberOS", "experiments"],
};

const fileContents: Record<string, string> = {
  "readme.txt":
    "Welcome to CyberOS v3.7.2\n\nThis is a simulated operating system.\nType 'help' for available commands.",
  "notes.txt":
    "TODO:\n- Finish the portfolio\n- Learn more about cybersecurity\n- Build cool projects",
  "ideas.md":
    "# Project Ideas\n\n1. AI-powered code assistant\n2. Decentralized social network\n3. Neural interface simulator",
};

const aiModelComparison = `
╔══════════════════════════════════════════════════════════════════════════╗
║                        AI MODELS COMPARISON                               ║
╠══════════════════════════════════════════════════════════════════════════╣
║  Claude Opus 4.7                                                          ║
║  ├─ Best for: Complex reasoning, code generation, long context           ║
║  ├─ Context: 200K tokens                                                  ║
║  └─ Strengths: Safety, accuracy, nuanced responses                        ║
╠──────────────────────────────────────────────────────────────────────────╣
║  Gemini 3.1 Pro                                                           ║
║  ├─ Best for: Multimodal tasks, real-time data                            ║
║  ├─ Context: 2M tokens                                                    ║
║  └─ Strengths: Google integration, speed, image understanding             ║
╠──────────────────────────────────────────────────────────────────────────╣
║  Kimi K2.6                                                                ║
║  ├─ Best for: Long documents, research papers                             ║
║  ├─ Context: 2M tokens                                                    ║
║  └─ Strengths: Extended context, document analysis                        ║
╚══════════════════════════════════════════════════════════════════════════╝
`
  .trim()
  .split("\n");

const codeChars = "{}[]()<>/*+-=;:.,!@#$%^&|~`01";

const appAliases: Record<string, AppId> = {
  terminal: "terminal",
  files: "files",
  browser: "browser",
  settings: "settings",
  notes: "notes",
  music: "music",
  snake: "snake",
  game: "snake",
  stack: "stack",
  about: "about",
  projects: "projects",
  project: "projects",
  contact: "contact",
  contacts: "contact",
};

const launchableApps = [
  "about",
  "projects",
  "contact",
  "stack",
  "notes",
  "files",
  "browser",
  "snake",
  "music",
  "settings",
];

export function TerminalApp() {
  const { openApp } = useWindows();
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "",
      output: [
        "CyberOS Terminal v3.7.2",
        "Type 'help' for available commands.",
        "",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [currentDir, setCurrentDir] = useState("~");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [powerMode, setPowerMode] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const controls = useAnimation();

  useEffect(() => {
    containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
  }, [history]);

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.5, // gravity
            life: p.life - 1,
          }))
          .filter((p) => p.life > 0),
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  const spawnParticles = useCallback(
    (x: number, y: number) => {
      if (!powerMode) return;

      const newParticles: Particle[] = [];
      for (let i = 0; i < 5; i++) {
        newParticles.push({
          id: particleIdRef.current++,
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8 - 3,
          life: 30,
          char: codeChars[Math.floor(Math.random() * codeChars.length)],
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
    },
    [powerMode],
  );

  const triggerShake = useCallback(() => {
    if (!powerMode) return;
    setShake(true);
    setTimeout(() => setShake(false), 50);
  }, [powerMode]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);

      if (powerMode && cursorRef.current) {
        const rect = cursorRef.current.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          spawnParticles(
            rect.left - containerRect.left,
            rect.top - containerRect.top,
          );
          triggerShake();
        }
      }
    },
    [powerMode, spawnParticles, triggerShake],
  );

  const animateOutput = useCallback(
    async (lines: string[], command: string) => {
      setIsAnimating(true);
      setHistory((prev) => [
        ...prev,
        { command, output: [], isAnimated: true },
      ]);

      for (let i = 0; i < lines.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 80));
        setHistory((prev) => {
          const newHistory = [...prev];
          const lastItem = newHistory[newHistory.length - 1];
          lastItem.output = [...lastItem.output, lines[i]];
          return newHistory;
        });
      }

      setIsAnimating(false);
    },
    [],
  );

  const executeCommand = useCallback(
    async (cmd: string) => {
      const parts = cmd.trim().split(" ");
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      let output: string[] = [];
      let isError = false;

      switch (command) {
        case "help":
          output = [
            "╔═══════════════════════════════════════════════════════════╗",
            "║                    AVAILABLE COMMANDS                      ║",
            "╠═══════════════════════════════════════════════════════════╣",
            "║  help              - Show this help message                ║",
            "║  clear             - Clear the terminal                    ║",
            "║  whoami            - Display current user info             ║",
            "║  date              - Show current date and time            ║",
            "║  echo [text]       - Print text to terminal                ║",
            "║  ping [host]       - Simulate network ping                 ║",
            "║  ls                - List directory contents               ║",
            "║  cd [dir]          - Change directory                      ║",
            "║  cat [file]        - Display file contents                 ║",
            "║  pwd               - Print working directory               ║",
            "║  open [app]        - Launch apps from terminal             ║",
            "║  apps              - List launchable apps                  ║",
            "║  projects          - Open Projects app                     ║",
            "║  contact           - Open Contact app                      ║",
            "║  sudo hire amir    - Secret collaboration command          ║",
            "║  optimize --ping   - Optimize system for gaming            ║",
            "║  fetch research    - Fetch AI model comparison             ║",
            "║  powermode         - Toggle power mode effects             ║",
            "╚═══════════════════════════════════════════════════════════╝",
            "",
          ];
          break;

        case "powermode":
          setPowerMode((prev) => !prev);
          output = [
            `Power Mode: ${!powerMode ? "ENABLED" : "DISABLED"}`,
            !powerMode
              ? "Screen shake and particle effects activated!"
              : "Effects disabled.",
            "",
          ];
          break;

        case "clear":
          setHistory([]);
          return;

        case "whoami":
          output = [
            "",
            "  ╭─────────────────────────────────────────────────────╮",
            "  │  Magauiya Amir | 15 y.o. | Vibe Coder from Kazakhstan  │",
            "  ╰─────────────────────────────────────────────────────╯",
            "",
          ];
          break;

        case "date":
          output = [new Date().toString(), ""];
          break;

        case "echo":
          output = [args.join(" "), ""];
          break;

        case "optimize":
          if (args[0] === "--ping") {
            const optimizeLines = [
              "",
              "[*] Initializing network optimization...",
              "[*] Detecting current configuration...",
              "",
              "[+] Stopping unnecessary services...",
              "    ├─ Windows Update Service... STOPPED",
              "    ├─ Superfetch... STOPPED",
              "    └─ Background Intelligent Transfer... STOPPED",
              "",
              "[+] Modifying TCP/IP parameters...",
              "    ├─ TcpAckFrequency = 1",
              "    ├─ TCPNoDelay = 1",
              "    ├─ TcpDelAckTicks = 0",
              "    └─ NetworkThrottlingIndex = DISABLED",
              "",
              "[+] Applying registry tweaks...",
              "    ├─ Nagle Algorithm... DISABLED",
              "    ├─ Network Throttling... DISABLED",
              "    └─ QoS Reserved Bandwidth... SET TO 0%",
              "",
              "[+] Flushing DNS cache...",
              "[+] Resetting Winsock catalog...",
              "",
              "╔═══════════════════════════════════════════════════════════╗",
              "║  ✓ PING OPTIMIZED FOR ONLINE GAMING                       ║",
              "║  Estimated latency reduction: 15-30ms                     ║",
              "╚═══════════════════════════════════════════════════════════╝",
              "",
            ];
            await animateOutput(optimizeLines, cmd);
            return;
          } else {
            output = ["Usage: optimize --ping", ""];
            isError = true;
          }
          break;

        case "fetch":
          if (args[0] === "research") {
            await animateOutput(["", ...aiModelComparison, ""], cmd);
            return;
          } else {
            output = ["Usage: fetch research", ""];
            isError = true;
          }
          break;

        case "ping":
          const target = args[0] || "localhost";
          output = [
            `PING ${target}:`,
            `  64 bytes from ${target}: time=12.3ms`,
            `  64 bytes from ${target}: time=11.8ms`,
            `  64 bytes from ${target}: time=13.1ms`,
            `  64 bytes from ${target}: time=12.0ms`,
            "",
            `--- ${target} ping statistics ---`,
            "4 packets transmitted, 4 received, 0% packet loss",
            "",
          ];
          break;

        case "ls":
          const dir = currentDir;
          const contents = fileSystem[dir];
          if (contents) {
            output = [
              ...contents.map((item) =>
                fileSystem[`${dir}/${item}`] ? `  ${item}/` : `  ${item}`,
              ),
              "",
            ];
          } else {
            output = ["Directory not found", ""];
            isError = true;
          }
          break;

        case "cd":
          const newDir = args[0];
          if (!newDir || newDir === "~") {
            setCurrentDir("~");
            output = [""];
          } else if (newDir === "..") {
            const cdParts = currentDir.split("/");
            cdParts.pop();
            setCurrentDir(cdParts.length ? cdParts.join("/") : "~");
            output = [""];
          } else {
            const targetDir = `${currentDir}/${newDir}`;
            if (fileSystem[targetDir]) {
              setCurrentDir(targetDir);
              output = [""];
            } else {
              output = [`cd: ${newDir}: No such directory`, ""];
              isError = true;
            }
          }
          break;

        case "cat":
          const fileName = args[0];
          if (fileName && fileContents[fileName]) {
            output = [...fileContents[fileName].split("\n"), ""];
          } else {
            output = [`cat: ${fileName || "?"}: No such file`, ""];
            isError = true;
          }
          break;

        case "apps":
          output = [
            "Launchable apps:",
            ...launchableApps.map((app) => `  - ${app}`),
            "",
            "Usage: open projects",
            "",
          ];
          break;

        case "open": {
          const appName = args[0]?.toLowerCase();
          const appId = appName ? appAliases[appName] : undefined;

          if (!appName || !appId) {
            output = [
              "Usage: open [app]",
              `Available: ${launchableApps.join(", ")}`,
              "",
            ];
            isError = true;
          } else {
            openApp(appId);
            output = [`Opening ${appId}...`, ""];
          }
          break;
        }

        case "projects":
        case "project":
          openApp("projects");
          output = ["Opening Projects app...", ""];
          break;

        case "contact":
        case "contacts":
          openApp("contact");
          output = ["Opening Contact app...", ""];
          break;

        case "about":
          openApp("about");
          output = ["Opening About app...", ""];
          break;

        case "stack":
          openApp("stack");
          output = ["Opening Stack app...", ""];
          break;

        case "snake":
          openApp("snake");
          output = ["Launching Neon Snake...", ""];
          break;

        case "sudo":
          if (args.join(" ").toLowerCase() === "hire amir") {
            openApp("contact");
            output = [
              "Access granted.",
              "Collaboration protocol initialized.",
              "Opening Contact app...",
              "",
            ];
          } else {
            output = ["sudo: permission denied, but nice try.", ""];
            isError = true;
          }
          break;

        case "pwd":
          output = [currentDir.replace("~", "/home/amir"), ""];
          break;

        case "":
          output = [""];
          break;

        default:
          output = [
            `Command not found: ${command}. Type 'help' for available commands.`,
            "",
          ];
          isError = true;
      }

      setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    },
    [currentDir, animateOutput, powerMode, openApp],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    if (input.trim()) {
      setCommandHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
    }
    executeCommand(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      animate={shake ? { x: [0, -2, 2, -2, 0] } : {}}
      transition={{ duration: 0.1 }}
      className="relative h-full bg-black/95 p-4 font-mono text-sm overflow-auto cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute text-cyan-400 pointer-events-none font-bold"
            style={{
              left: particle.x,
              top: particle.y,
              textShadow: "0 0 5px rgba(0, 255, 255, 0.8)",
            }}
          >
            {particle.char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Power mode indicator */}
      {powerMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 text-[10px] text-cyan-400/50 font-mono"
        >
          POWER MODE
        </motion.div>
      )}

      <AnimatePresence>
        {history.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className="mb-1"
          >
            {item.command && (
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">amir@cyberOS</span>
                <span className="text-muted-foreground">:</span>
                <span className="text-blue-400">{currentDir}</span>
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">{item.command}</span>
              </div>
            )}
            {item.output.map((line, lineIndex) => (
              <motion.div
                key={lineIndex}
                initial={item.isAnimated ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05 }}
                className={`whitespace-pre ${item.isError ? "text-red-400" : "text-foreground/90"}`}
              >
                {line || "\u00A0"}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <span className="text-cyan-400">amir@cyberOS</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-blue-400">{currentDir}</span>
        <span className="text-muted-foreground">$</span>
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isAnimating}
            className="w-full bg-transparent outline-none text-foreground caret-transparent disabled:opacity-50"
            autoFocus
            spellCheck={false}
          />
          {/* Custom cursor */}
          <div
            ref={cursorRef}
            className="absolute top-0 h-full flex items-center pointer-events-none"
            style={{ left: `${input.length * 0.6}em` }}
          >
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="w-2 h-4 bg-cyan-400"
              style={{
                boxShadow: powerMode
                  ? "0 0 10px rgba(0, 255, 255, 0.8)"
                  : "none",
              }}
            />
          </div>
          <span className="absolute top-0 left-0 text-foreground pointer-events-none">
            {input}
          </span>
        </div>
        {isAnimating && (
          <span className="text-cyan-400 animate-pulse">...</span>
        )}
      </form>
    </motion.div>
  );
}
