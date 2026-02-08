'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileTree } from '@/components/file-tree/file-tree';
import { PreviewFrame } from '@/components/preview/preview-frame';
import { Console } from '@/components/terminal/console';
import { SettingsModal } from '@/components/settings/settings-modal';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';
import { useStore } from '@/lib/store';
import { Download, Settings, Home, Menu, X } from 'lucide-react';
import JSZip from 'jszip';
import Link from 'next/link';

export default function EditorPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { vfs, hasSeenWelcome } = useStore();

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
            title="Toggle Menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Chat */}
        <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 border-r border-white/10 overflow-hidden lg:w-96`}>
          <ChatInterface onOpenSettings={() => setShowSettings(true)} />
        </div>

        {/* Middle: File Tree + Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex overflow-hidden">
            <div className="w-64 border-r border-white/10 glass">
              <FileTree />
            </div>
            <div className="flex-1 min-w-0">
              <CodeEditor />
            </div>
          </div>

          {/* Bottom: Console */}
          {showConsole && (
            <div className="h-48 border-t border-white/10 glass backdrop-blur-xl">
              <Console />
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 border-l border-white/10 glass hidden xl:block">
          <PreviewFrame />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
