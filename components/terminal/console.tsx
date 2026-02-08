'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Terminal, Trash2 } from 'lucide-react';

export function Console() {
  const { consoleLogs, clearConsole } = useStore();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '>';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-white">Console</h3>
          <span className="text-xs text-gray-500">({consoleLogs.length})</span>
        </div>
        <button
          onClick={clearConsole}
          className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-white"
          title="Clear console"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-sm">
        {consoleLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Console output will appear here
          </div>
        ) : (
          consoleLogs.map((log) => (
            <div key={log.id} className={`py-1 ${getLogColor(log.type)} flex gap-2`}>
              <span className="flex-shrink-0">{getLogIcon(log.type)}</span>
              <span className="break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={consoleEndRef} />
      </div>
    </div>
  );
}
