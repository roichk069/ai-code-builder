import { create } from 'zustand';
import { VirtualFileSystem } from './fs';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
}

interface AppState {
  // File System
  vfs: VirtualFileSystem;
  currentFile: string | null;
  setCurrentFile: (path: string | null) => void;
  updateFile: (path: string, content: string) => void;
  deleteFile: (path: string) => void;
  loadTemplate: (files: Record<string, string>) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Console
  consoleLogs: ConsoleLog[];
  addConsoleLog: (log: Omit<ConsoleLog, 'id' | 'timestamp'>) => void;
  clearConsole: () => void;

  // UI State
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  previewKey: number;
  refreshPreview: () => void;

  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // File System
  vfs: new VirtualFileSystem(),
  currentFile: null,
  setCurrentFile: (path) => set({ currentFile: path }),
  updateFile: (path, content) => {
    const { vfs } = get();
    vfs.setFile(path, content);
    set({ vfs: new VirtualFileSystem(), previewKey: get().previewKey + 1 });
    get().vfs.setFiles(vfs.getAllFiles());
  },
  deleteFile: (path) => {
    const { vfs, currentFile } = get();
    vfs.deleteFile(path);
    set({
      vfs: new VirtualFileSystem(),
      currentFile: currentFile === path ? null : currentFile,
    });
    get().vfs.setFiles(vfs.getAllFiles());
  },
  loadTemplate: (files) => {
    const { vfs } = get();
    vfs.clear();
    Object.entries(files).forEach(([path, content]) => {
      vfs.setFile(path, content);
    });
    set({
      vfs: new VirtualFileSystem(),
      currentFile: '/index.html',
      previewKey: get().previewKey + 1,
    });
    get().vfs.setFiles(vfs.getAllFiles());
  },

  // Chat
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // Console
  consoleLogs: [],
  addConsoleLog: (log) =>
    set((state) => ({
      consoleLogs: [
        ...state.consoleLogs,
        {
          ...log,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        },
      ],
    })),
  clearConsole: () => set({ consoleLogs: [] }),

  // UI State
  isGenerating: false,
  setIsGenerating: (value) => set({ isGenerating: value }),
  previewKey: 0,
  refreshPreview: () => set((state) => ({ previewKey: state.previewKey + 1 })),

  // API Key
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
  selectedModel: 'anthropic/claude-3.5-sonnet',
  setSelectedModel: (model) => set({ selectedModel: model }),
}));
