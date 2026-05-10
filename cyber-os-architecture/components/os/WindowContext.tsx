"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { WindowState, AppId } from "./types";

const defaultApps: Record<
  AppId,
  Omit<WindowState, "id" | "isOpen" | "isMinimized" | "isMaximized" | "zIndex">
> = {
  terminal: {
    title: "Terminal",
    icon: "terminal",
    position: { x: 100, y: 80 },
    size: { width: 700, height: 450 },
    component: "terminal",
  },
  files: {
    title: "File Explorer",
    icon: "folder",
    position: { x: 150, y: 100 },
    size: { width: 800, height: 500 },
    component: "files",
  },
  browser: {
    title: "Browser",
    icon: "globe",
    position: { x: 200, y: 120 },
    size: { width: 900, height: 600 },
    component: "browser",
  },
  settings: {
    title: "Settings",
    icon: "settings",
    position: { x: 250, y: 140 },
    size: { width: 700, height: 500 },
    component: "settings",
  },
  notes: {
    title: "Notes",
    icon: "file-text",
    position: { x: 180, y: 110 },
    size: { width: 500, height: 400 },
    component: "notes",
  },
  music: {
    title: "Music Player",
    icon: "music",
    position: { x: 220, y: 130 },
    size: { width: 400, height: 500 },
    component: "music",
  },
  snake: {
    title: "Neon Snake",
    icon: "gamepad",
    position: { x: 120, y: 90 },
    size: { width: 600, height: 500 },
    component: "snake",
  },
  stack: {
    title: "My Stack",
    icon: "layers",
    position: { x: 160, y: 100 },
    size: { width: 550, height: 500 },
    component: "stack",
  },
  about: {
    title: "About Me",
    icon: "user",
    position: { x: 140, y: 85 },
    size: { width: 500, height: 600 },
    component: "about",
  },
  projects: {
    title: "Projects",
    icon: "code",
    position: { x: 190, y: 105 },
    size: { width: 820, height: 560 },
    component: "projects",
  },
  contact: {
    title: "Contact",
    icon: "mail",
    position: { x: 210, y: 115 },
    size: { width: 720, height: 520 },
    component: "contact",
  },
};

interface WindowContextType {
  windows: WindowState[];
  openApp: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number },
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number },
  ) => void;
  getHighestZIndex: () => number;
}

const WindowContext = createContext<WindowContextType | null>(null);

export function useWindows() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindows must be used within a WindowProvider");
  }
  return context;
}

export function WindowProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [zIndexCounter, setZIndexCounter] = useState(100);

  const getHighestZIndex = useCallback(() => zIndexCounter, [zIndexCounter]);

  const openApp = useCallback(
    (appId: AppId) => {
      const existingWindow = windows.find((w) => w.component === appId);

      if (existingWindow) {
        setWindows((prev) =>
          prev.map((w) =>
            w.id === existingWindow.id
              ? { ...w, isMinimized: false, zIndex: zIndexCounter + 1 }
              : w,
          ),
        );
        setZIndexCounter((prev) => prev + 1);
        return;
      }

      const appConfig = defaultApps[appId];
      const newWindow: WindowState = {
        id: `${appId}-${Date.now()}`,
        ...appConfig,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: zIndexCounter + 1,
      };

      setWindows((prev) => [...prev, newWindow]);
      setZIndexCounter((prev) => prev + 1);
    },
    [windows, zIndexCounter],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)),
    );
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: true } : w)),
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false } : w,
      ),
    );
  }, []);

  const focusWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id
            ? { ...w, zIndex: zIndexCounter + 1, isMinimized: false }
            : w,
        ),
      );
      setZIndexCounter((prev) => prev + 1);
    },
    [zIndexCounter],
  );

  const updateWindowPosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w)),
      );
    },
    [],
  );

  const updateWindowSize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
    },
    [],
  );

  return (
    <WindowContext.Provider
      value={{
        windows,
        openApp,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        updateWindowPosition,
        updateWindowSize,
        getHighestZIndex,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}
