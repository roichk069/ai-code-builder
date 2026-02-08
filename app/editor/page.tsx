'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/chat-interface';
import { CodeEditor } from '@/components/editor/code-editor';
import { FileTree } from '@/components/file-tree/file-tree';
import { PreviewFrame } from '@/components/preview/preview-frame';
import { Console } from '@/components/terminal/console';
import { SettingsModal } from '@/components/settings/settings-modal';
import { useStore } from '@/lib/store';
import { Download, Settings, Home } from 'lucide-react';
import JSZip from 'jszip';
import Link from 'next/link';

export default function EditorPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [showConsole, setShowConsole] = useState(true);
  const { vfs } = useStore();

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

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80">
            <Home className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">AI Code Builder</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat */}
        <div className="w-96 border-r border-white/10">
          <ChatInterface />
        </div>

        {/* Middle: File Tree + Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex overflow-hidden">
            <div className="w-64 border-r border-white/10">
              <FileTree />
            </div>
            <div className="flex-1">
              <CodeEditor />
            </div>
          </div>

          {/* Bottom: Console */}
          {showConsole && (
            <div className="h-48 border-t border-white/10">
              <Console />
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 border-l border-white/10">
          <PreviewFrame />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
