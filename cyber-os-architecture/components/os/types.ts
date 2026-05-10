export type AppId =
  | "terminal"
  | "files"
  | "browser"
  | "settings"
  | "notes"
  | "music"
  | "snake"
  | "stack"
  | "about"
  | "projects"
  | "contact";

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  component: AppId;
}

export interface SnapZone {
  zone:
    | "left"
    | "right"
    | "top"
    | "bottom"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "maximize"
    | null;
  preview: { x: number; y: number; width: number; height: number } | null;
}

export interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: string;
  modified?: string;
  content?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
}
