'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import {
  Download,
  Home,
  Layout,
  Menu,
  Monitor,
  Settings,
  Terminal,
  X,
} from 'lucide-react';

import { ChatInterface } from '@/components/chat/chat-interface';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileTree } from '@/components/file-tree/file-tree';
import { PreviewFrame } from '@/components/preview/preview-frame';
import { SettingsModal } from '@/components/settings/settings-modal';
import { TemplatesModal } from '@/components/templates/templates-modal';
import { Console } from '@/components/terminal/console';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';
import { useStore } from '@/lib/store';

export default function EditorPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  // On mobile this controls chat visibility; on desktop chat is always visible.
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  // Resizable pane sizes (px). Persisted locally for a Bolt-like feel.
  const [chatWidth, setChatWidth] = useState(() => {
    if (typeof window === 'undefined') return 384;
    try {
      const raw = localStorage.getItem('acb:paneSizes');
      const parsed = raw ? JSON.parse(raw) : null;
      return typeof parsed?.chatWidth === 'number' ? parsed.chatWidth : 384;
    } catch {
      return 384;
    }
  });
  const [treeWidth, setTreeWidth] = useState(() => {
    if (typeof window === 'undefined') return 256;
    try {
      const raw = localStorage.getItem('acb:paneSizes');
      const parsed = raw ? JSON.parse(raw) : null;
      return typeof parsed?.treeWidth === 'number' ? parsed.treeWidth : 256;
    } catch {
      return 256;
    }
  });
  const [previewWidth, setPreviewWidth] = useState(() => {
    if (typeof window === 'undefined') return 520;
    try {
      const raw = localStorage.getItem('acb:paneSizes');
      const parsed = raw ? JSON.parse(raw) : null;
      return typeof parsed?.previewWidth === 'number' ? parsed.previewWidth : 520;
    } catch {
      return 520;
    }
  });

  const dragRef = useRef<null | {
    kind: 'chat' | 'tree' | 'preview';
    startX: number;
    start: number;
  }>(null);

  const { vfs, hasSeenWelcome } = useStore();

  const [isLgUp, setIsLgUp] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 1024px)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsLgUp(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('acb:paneSizes', JSON.stringify({ chatWidth, treeWidth, previewWidth }));
    } catch {
      // ignore
    }
  }, [chatWidth, treeWidth, previewWidth]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = e.clientX - dragRef.current.startX;
      const next = dragRef.current.start + delta;

      if (dragRef.current.kind === 'chat') setChatWidth(Math.min(520, Math.max(280, next)));
      if (dragRef.current.kind === 'tree') setTreeWidth(Math.min(420, Math.max(200, next)));
      if (dragRef.current.kind === 'preview') setPreviewWidth(Math.min(900, Math.max(360, next)));
    };
    const onUp = () => {
      dragRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = (kind: 'chat' | 'tree' | 'preview', start: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { kind, startX: e.clientX, start };
  };

  const handleExport = async () => {
    const zip = new JSZip();
    const files = vfs.getAllFiles();

    files.forEach((content, path) => {
      // Remove leading slash for zip paths
      const zipPath = path.startsWith('/') ? path.slice(1) : path;
      zip.file(zipPath, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleWelcomeComplete = () => {
    // Welcome screen will handle setting hasSeenWelcome
  };

  if (!hasSeenWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 gradient-mesh">
      {/* Header */}
      <header className="h-14 glass border-b border-white/10 flex items-center justify-between px-4 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white hidden sm:block">AI Code Builder</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-white rounded-lg transition-smooth btn-hover"
            title="Templates"
          >
            <Layout className="w-4 h-4" />
            <span className="hidden md:inline">Templates</span>
          </button>

          <button
            onClick={() => setShowPreviewMobile(true)}
            className="flex xl:hidden items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-white rounded-lg transition-smooth btn-hover"
            title="Preview"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => setShowConsole((v) => !v)}
            className="hidden md:flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-white rounded-lg transition-smooth btn-hover"
            title="Console"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden lg:inline">Console</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-white rounded-lg transition-smooth btn-hover"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 glass hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-smooth"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 glass hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-smooth lg:hidden"
            title="Toggle Chat"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Chat */}
        <div
          className={`${sidebarOpen ? 'block' : 'hidden'} border-r border-white/10 overflow-hidden lg:block`}
          style={{ width: sidebarOpen || isLgUp ? chatWidth : 0 }}
        >
          <ChatInterface onOpenSettings={() => setShowSettings(true)} />
        </div>

        {/* Drag handle: Chat */}
        {(sidebarOpen || isLgUp) && (
          <div
            className="hidden lg:flex w-2 cursor-col-resize items-stretch justify-center bg-white/0 hover:bg-white/5 transition-colors"
            onMouseDown={startDrag('chat', chatWidth)}
            title="Resize chat"
          >
            <div className="w-px bg-white/10" />
          </div>
        )}

        {/* Middle: File Tree + Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            <div className="hidden md:block border-r border-white/10 glass" style={{ width: treeWidth }}>
              <FileTree />
            </div>

            {/* Drag handle: File tree */}
            <div
              className="hidden md:flex w-2 cursor-col-resize items-stretch justify-center bg-white/0 hover:bg-white/5 transition-colors"
              onMouseDown={startDrag('tree', treeWidth)}
              title="Resize file tree"
            >
              <div className="w-px bg-white/10" />
            </div>

            <div className="flex-1 min-w-0">
              <CodeEditor />
            </div>
          </div>

          {/* Bottom: Console */}
          {showConsole && (
            <div className="h-52 border-t border-white/10 glass backdrop-blur-xl">
              <Console />
            </div>
          )}
        </div>

        {/* Drag handle: Preview */}
        <div
          className="hidden xl:flex w-2 cursor-col-resize items-stretch justify-center bg-white/0 hover:bg-white/5 transition-colors"
          onMouseDown={startDrag('preview', previewWidth)}
          title="Resize preview"
        >
          <div className="w-px bg-white/10" />
        </div>

        {/* Right: Preview */}
        <div className="border-l border-white/10 glass hidden xl:block" style={{ width: previewWidth }}>
          <PreviewFrame />
        </div>
      </div>

      {/* Mobile/Tablet Preview Drawer */}
      {showPreviewMobile && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPreviewMobile(false)}
          />
          <div className="absolute inset-x-0 bottom-0 top-14 glass-strong border-t border-white/10 shadow-2xl">
            <div className="h-12 flex items-center justify-between px-4 border-b border-white/10">
              <div className="text-white font-semibold flex items-center gap-2">
                <Monitor className="w-4 h-4" /> Preview
              </div>
              <button
                onClick={() => setShowPreviewMobile(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-smooth"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <PreviewFrame />
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      <TemplatesModal open={showTemplates} onOpenChange={setShowTemplates} />

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
