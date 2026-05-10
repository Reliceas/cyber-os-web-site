"use client"

import { useState, useRef } from "react"
import { ArrowLeft, ArrowRight, RotateCw, Lock, X, Plus } from "lucide-react"

export function BrowserApp() {
  const [url, setUrl] = useState("https://en.wikipedia.org")
  const [inputUrl, setInputUrl] = useState("https://en.wikipedia.org")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let newUrl = inputUrl.trim()
    
    // Add https:// if no protocol specified
    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
      newUrl = "https://" + newUrl
    }
    
    setUrl(newUrl)
    setInputUrl(newUrl)
    setIsLoading(true)
    setError(null)
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      iframeRef.current.src = url
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError("This site cannot be displayed in an iframe due to security restrictions.")
  }

  // Suggested safe sites that allow iframe embedding
  const safeSites = [
    { name: "Wikipedia", url: "https://en.wikipedia.org" },
    { name: "Example.com", url: "https://example.com" },
    { name: "Archive.org", url: "https://archive.org" },
  ]

  return (
    <div className="h-full flex flex-col bg-[#1a1a2e]">
      {/* Arc/Safari style URL bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#0f0f1a] border-b border-white/10">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input - Arc/Safari style pill */}
        <form onSubmit={handleSubmit} className="flex-1">
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-green-400" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter URL..."
              className="w-full pl-9 pr-10 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all"
            />
            <button
              type="button"
              onClick={handleRefresh}
              className="absolute right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 text-white/60 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </form>

        {/* New tab button */}
        <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Browser content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 bg-[#1a1a2e] flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-white/60">Loading...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center p-8 z-10">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Cannot Load Page</h2>
              <p className="text-white/60 text-sm mb-6">{error}</p>
              
              <div className="space-y-2">
                <p className="text-white/40 text-xs">Try one of these sites instead:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {safeSites.map((site) => (
                    <button
                      key={site.url}
                      onClick={() => {
                        setUrl(site.url)
                        setInputUrl(site.url)
                        setError(null)
                        setIsLoading(true)
                      }}
                      className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-full text-sm transition-colors"
                    >
                      {site.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Browser Content"
          />
        )}
      </div>
    </div>
  )
}
