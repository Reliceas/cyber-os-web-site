"use client"

import { useState } from "react"
import { Folder, File, ChevronRight, Home, HardDrive, Download, FileText, Image, Music, Archive } from "lucide-react"

interface FileItem {
  name: string
  type: "folder" | "file"
  size?: string
  modified?: string
  icon?: typeof File
}

const fileSystem: Record<string, FileItem[]> = {
  "/": [
    { name: "Home", type: "folder" },
    { name: "Documents", type: "folder" },
    { name: "Downloads", type: "folder" },
    { name: "Projects", type: "folder" },
    { name: "Music", type: "folder" },
    { name: "Pictures", type: "folder" },
  ],
  "/Home": [
    { name: "readme.txt", type: "file", size: "2 KB", modified: "Jan 15, 2026", icon: FileText },
    { name: "notes.md", type: "file", size: "4 KB", modified: "Feb 20, 2026", icon: FileText },
  ],
  "/Documents": [
    { name: "resume.pdf", type: "file", size: "156 KB", modified: "Mar 10, 2026", icon: FileText },
    { name: "portfolio.docx", type: "file", size: "2.3 MB", modified: "Apr 5, 2026", icon: FileText },
    { name: "ideas.txt", type: "file", size: "1 KB", modified: "May 1, 2026", icon: FileText },
  ],
  "/Downloads": [
    { name: "setup.exe", type: "file", size: "45 MB", modified: "Apr 22, 2026", icon: Archive },
    { name: "image.png", type: "file", size: "2.1 MB", modified: "Apr 20, 2026", icon: Image },
    { name: "archive.zip", type: "file", size: "150 MB", modified: "Apr 18, 2026", icon: Archive },
  ],
  "/Projects": [
    { name: "cyberOS", type: "folder" },
    { name: "portfolio-v2", type: "folder" },
    { name: "experiments", type: "folder" },
  ],
  "/Projects/cyberOS": [
    { name: "index.ts", type: "file", size: "8 KB", modified: "May 8, 2026", icon: FileText },
    { name: "styles.css", type: "file", size: "4 KB", modified: "May 8, 2026", icon: FileText },
    { name: "components", type: "folder" },
  ],
  "/Music": [
    { name: "synthwave_mix.mp3", type: "file", size: "8.5 MB", modified: "Mar 15, 2026", icon: Music },
    { name: "ambient_sounds.mp3", type: "file", size: "12 MB", modified: "Feb 28, 2026", icon: Music },
  ],
  "/Pictures": [
    { name: "screenshot.png", type: "file", size: "1.2 MB", modified: "May 5, 2026", icon: Image },
    { name: "wallpaper.jpg", type: "file", size: "3.8 MB", modified: "Apr 10, 2026", icon: Image },
  ],
}

const sidebarItems = [
  { name: "Home", icon: Home, path: "/Home" },
  { name: "Documents", icon: FileText, path: "/Documents" },
  { name: "Downloads", icon: Download, path: "/Downloads" },
  { name: "This PC", icon: HardDrive, path: "/" },
]

export function FilesApp() {
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const pathParts = currentPath.split("/").filter(Boolean)
  const files = fileSystem[currentPath] || []

  const navigateTo = (path: string) => {
    setCurrentPath(path)
    setSelectedFile(null)
  }

  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      navigateTo(`${currentPath}${currentPath === "/" ? "" : "/"}${item.name}`)
    } else {
      setSelectedFile(item.name)
    }
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") {
      navigateTo(`${currentPath}${currentPath === "/" ? "" : "/"}${item.name}`)
    }
  }

  return (
    <div className="h-full flex bg-background">
      {/* Sidebar */}
      <div className="w-48 border-r border-border bg-muted/30 p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigateTo(item.path)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors ${
                currentPath === item.path
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 text-cyan-400" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-4 py-2 border-b border-border bg-muted/20">
          <button
            onClick={() => navigateTo("/")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Root
          </button>
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <button
                onClick={() => navigateTo("/" + pathParts.slice(0, index + 1).join("/"))}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {part}
              </button>
            </div>
          ))}
        </div>

        {/* File Grid */}
        <div className="flex-1 p-4 overflow-auto">
          {files.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              This folder is empty
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {files.map((item) => {
                const IconComponent = item.type === "folder" ? Folder : (item.icon || File)
                return (
                  <button
                    key={item.name}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-sm transition-colors ${
                      selectedFile === item.name
                        ? "bg-accent/50 ring-1 ring-cyan-400/50"
                        : "hover:bg-muted"
                    }`}
                  >
                    <IconComponent
                      className={`w-10 h-10 ${
                        item.type === "folder" ? "text-yellow-400" : "text-cyan-400"
                      }`}
                    />
                    <div className="text-center">
                      <div className="text-sm truncate max-w-[100px]">{item.name}</div>
                      {item.size && (
                        <div className="text-xs text-muted-foreground">{item.size}</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          {files.length} items
          {selectedFile && ` | Selected: ${selectedFile}`}
        </div>
      </div>
    </div>
  )
}
