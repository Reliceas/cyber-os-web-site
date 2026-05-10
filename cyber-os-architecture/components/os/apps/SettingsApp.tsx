"use client"

import { useState, useEffect } from "react"
import { Monitor, Wifi, Shield, Bell, Palette, Info, Volume2, Battery, User, Check } from "lucide-react"

interface SettingCategory {
  id: string
  label: string
  icon: typeof Monitor
}

const categories: SettingCategory[] = [
  { id: "personalization", label: "Personalization", icon: Palette },
  { id: "system", label: "System", icon: Monitor },
  { id: "network", label: "Network", icon: Wifi },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "power", label: "Power", icon: Battery },
  { id: "accounts", label: "Accounts", icon: User },
  { id: "about", label: "About", icon: Info },
]

const wallpaperOptions = [
  {
    id: "default",
    name: "Dark Cyberpunk",
    preview: "from-slate-900 via-slate-800 to-slate-900",
    description: "Default dark theme with subtle stars",
  },
  {
    id: "gradient-blue",
    name: "Deep Blue",
    preview: "from-blue-900 via-slate-900 to-teal-900",
    description: "Ocean depths with teal accents",
  },
  {
    id: "matrix",
    name: "Matrix Green",
    preview: "from-green-900 via-black to-green-900",
    description: "Classic matrix rain effect",
  },
]

interface SettingsAppProps {
  onWallpaperChange?: (wallpaper: string) => void
  currentWallpaper?: string
}

export function SettingsApp({ onWallpaperChange, currentWallpaper = "default" }: SettingsAppProps) {
  const [activeCategory, setActiveCategory] = useState("personalization")
  const [selectedWallpaper, setSelectedWallpaper] = useState(currentWallpaper)
  const [settings, setSettings] = useState({
    darkMode: true,
    animations: true,
    transparency: true,
    notifications: true,
    sounds: true,
    autoUpdates: true,
    firewall: true,
    encryption: true,
  })

  // Sync with prop changes
  useEffect(() => {
    setSelectedWallpaper(currentWallpaper)
  }, [currentWallpaper])

  const handleWallpaperSelect = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId)
    if (onWallpaperChange) {
      onWallpaperChange(wallpaperId)
    }
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cyber-os-wallpaper", wallpaperId)
    }
  }

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderContent = () => {
    switch (activeCategory) {
      case "personalization":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Personalization</h2>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Desktop Wallpaper
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {wallpaperOptions.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => handleWallpaperSelect(wallpaper.id)}
                    className={`relative flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      selectedWallpaper === wallpaper.id
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-border/50 hover:border-border bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    {/* Preview gradient */}
                    <div
                      className={`w-16 h-10 rounded-md bg-gradient-to-br ${wallpaper.preview} border border-white/10 flex-shrink-0`}
                    />
                    
                    {/* Info */}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground">{wallpaper.name}</div>
                      <div className="text-sm text-muted-foreground">{wallpaper.description}</div>
                    </div>

                    {/* Check mark */}
                    {selectedWallpaper === wallpaper.id && (
                      <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "system":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">System</h2>
            <div className="space-y-4">
              <SettingToggle
                label="Dark Mode"
                description="Use dark theme across the system"
                checked={settings.darkMode}
                onChange={() => toggleSetting("darkMode")}
              />
              <SettingToggle
                label="Enable Animations"
                description="Show animations and transitions"
                checked={settings.animations}
                onChange={() => toggleSetting("animations")}
              />
              <SettingToggle
                label="Transparency Effects"
                description="Enable acrylic blur effects"
                checked={settings.transparency}
                onChange={() => toggleSetting("transparency")}
              />
              <SettingToggle
                label="Auto Updates"
                description="Automatically download and install updates"
                checked={settings.autoUpdates}
                onChange={() => toggleSetting("autoUpdates")}
              />
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Security</h2>
            <div className="space-y-4">
              <SettingToggle
                label="Firewall"
                description="Block unauthorized network access"
                checked={settings.firewall}
                onChange={() => toggleSetting("firewall")}
              />
              <SettingToggle
                label="Data Encryption"
                description="Encrypt all stored data with AES-256"
                checked={settings.encryption}
                onChange={() => toggleSetting("encryption")}
              />
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-400" />
                  <div>
                    <div className="font-medium text-foreground">System Protected</div>
                    <div className="text-sm text-muted-foreground">
                      All security features are active
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "about":
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">About</h2>
            <div className="p-6 bg-muted rounded-lg space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">OS</span>
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{"Amir's CyberOS"}</div>
                  <div className="text-muted-foreground">Version 2.0</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner</span>
                  <span className="text-foreground">Magauiya Amir</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="text-foreground">15 years old</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="text-foreground">Kazakhstan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="text-foreground">Vibe Coder</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {"Amir's CyberOS is a simulated operating system showcasing vibe coding skills."}
            </p>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-lg mb-2">Coming Soon</div>
              <div className="text-sm">This settings page is under development</div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-56 border-r border-border bg-muted/30 p-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-foreground mb-4">Settings</h1>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeCategory === category.id
                  ? "bg-cyan-400/20 text-cyan-400"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <category.icon className={`w-4 h-4 ${activeCategory === category.id ? "text-cyan-400" : ""}`} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  )
}

interface SettingToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

function SettingToggle({ label, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
      <div>
        <div className="font-medium text-foreground">{label}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          checked ? "bg-cyan-400" : "bg-muted-foreground/30"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
