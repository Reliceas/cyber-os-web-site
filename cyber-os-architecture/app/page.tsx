"use client";

import { useState, useCallback, useEffect } from "react";
import { BootSequence } from "@/components/os/BootSequence";
import { Desktop } from "@/components/os/Desktop";

const BOOT_STORAGE_KEY = "cyber-os-boot-complete";

export default function Home() {
  const [isBooted, setIsBooted] = useState(false);
  const [hasCheckedBootPreference, setHasCheckedBootPreference] =
    useState(false);

  useEffect(() => {
    const hasBootedBefore =
      typeof window !== "undefined" &&
      window.localStorage.getItem(BOOT_STORAGE_KEY) === "true";

    setIsBooted(hasBootedBefore);
    setHasCheckedBootPreference(true);
  }, []);

  const handleBootComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BOOT_STORAGE_KEY, "true");
    }

    setIsBooted(true);
  }, []);

  if (!hasCheckedBootPreference) {
    return (
      <main className="dark">
        <div className="fixed inset-0 bg-black flex items-center justify-center text-cyan-300 font-mono text-sm">
          <span className="animate-pulse">Starting CyberOS...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="dark">
      {!isBooted ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </main>
  );
}
