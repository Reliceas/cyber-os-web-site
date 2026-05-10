"use client"

import { useState } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music } from "lucide-react"

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
}

const playlist: Track[] = [
  { id: "1", title: "Neon Dreams", artist: "Synthwave Collective", album: "Digital Horizons", duration: 234 },
  { id: "2", title: "Midnight Runner", artist: "CyberPunk FM", album: "Night City Beats", duration: 198 },
  { id: "3", title: "Electric Soul", artist: "The Machines", album: "Artificial Hearts", duration: 267 },
  { id: "4", title: "Data Stream", artist: "Binary Code", album: "System Error", duration: 312 },
  { id: "5", title: "Retrowave", artist: "80s Revival", album: "Time Machine", duration: 245 },
  { id: "6", title: "Chrome Heart", artist: "Neo Tokyo", album: "Future Past", duration: 289 },
  { id: "7", title: "Digital Rain", artist: "Matrix Sounds", album: "The Grid", duration: 256 },
  { id: "8", title: "Laser Light", artist: "Arcade Nights", album: "Game Over", duration: 223 },
]

export function MusicApp() {
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setProgress(0)
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  const nextTrack = () => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id)
    const nextIndex = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length
    playTrack(playlist[nextIndex])
  }

  const prevTrack = () => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id)
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    playTrack(playlist[prevIndex])
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Playlist */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-foreground mb-4">Playlist</h2>
          <div className="space-y-1">
            {playlist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track)}
                className={`w-full flex items-center gap-3 p-3 rounded-sm transition-colors ${
                  currentTrack.id === track.id
                    ? "bg-accent"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-sm flex items-center justify-center">
                  {currentTrack.id === track.id && isPlaying ? (
                    <div className="flex items-end gap-0.5 h-4">
                      <div className="w-1 bg-cyan-400 animate-pulse" style={{ height: "60%" }} />
                      <div className="w-1 bg-cyan-400 animate-pulse" style={{ height: "100%", animationDelay: "0.1s" }} />
                      <div className="w-1 bg-cyan-400 animate-pulse" style={{ height: "40%", animationDelay: "0.2s" }} />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm ${currentTrack.id === track.id ? "text-cyan-400" : "text-foreground"}`}>
                    {track.title}
                  </div>
                  <div className="text-xs text-muted-foreground">{track.artist}</div>
                </div>
                <div className="text-xs text-muted-foreground">{formatTime(track.duration)}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Now Playing Bar */}
      <div className="border-t border-border bg-muted/30 p-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-sm flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-foreground">{currentTrack.title}</div>
            <div className="text-sm text-muted-foreground">{currentTrack.artist}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(Math.floor((progress / 100) * currentTrack.duration))}
          </span>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTrack.duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`p-2 rounded-sm transition-colors ${
              shuffle ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={prevTrack}
              className="p-2 hover:bg-muted rounded-sm transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-cyan-400 hover:bg-cyan-500 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background" />
              ) : (
                <Play className="w-5 h-5 text-background ml-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2 hover:bg-muted rounded-sm transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => setRepeat(!repeat)}
            className={`p-2 rounded-sm transition-colors ${
              repeat ? "text-cyan-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mt-3">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full"
          />
          <span className="text-xs text-muted-foreground w-8">{volume}%</span>
        </div>
      </div>
    </div>
  )
}
