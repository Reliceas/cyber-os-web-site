"use client"

import { useState, useCallback } from "react"
import { BootSequence } from "@/components/os/BootSequence"
import { Desktop } from "@/components/os/Desktop"

export default function Home() {
  const [isBooted, setIsBooted] = useState(false)

  const handleBootComplete = useCallback(() => {
    setIsBooted(true)
  }, [])

  return (
    <main className="dark">
      {!isBooted ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </main>
  )
}
