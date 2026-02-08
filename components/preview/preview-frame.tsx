'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { RefreshCw, ExternalLink, Monitor, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { vfs, previewKey, refreshPreview, addConsoleLog } = useStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;

    setLoading(true);
    const files = vfs.getAllFiles();
    const indexHtml = files.get('/index.html') || '';

    if (!indexHtml) {
      // Show beautiful empty state
      const emptyHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #38bdf8 100%);
                background-size: 200% 200%;
                animation: gradientShift 10s ease infinite;
                color: white;
              }
              @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .container {
                text-align: center;
                padding: 2rem;
                backdrop-filter: blur(10px);
                background: rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 500px;
              }
              .icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                animation: pulse 2s ease-in-out infinite;
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
              h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                font-weight: 700;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
              }
              p {
                font-size: 1.2rem;
                opacity: 0.95;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✨</div>
              <h1>Live Preview</h1>
              <p>Your creation will appear here once you start building with AI</p>
            </div>
          </body>
        </html>
      `;
      iframeRef.current.srcdoc = emptyHtml;
      setLoading(false);
      return;
    }

    // Inject console capture script
    const consoleScript = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          const originalInfo = console.info;

          console.log = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'log', message: args.join(' ') }, '*');
            originalLog.apply(console, args);
          };

          console.error = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'error', message: args.join(' ') }, '*');
            originalError.apply(console, args);
          };

          console.warn = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'warn', message: args.join(' ') }, '*');
            originalWarn.apply(console, args);
          };

          console.info = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'info', message: args.join(' ') }, '*');
            originalInfo.apply(console, args);
          };

          window.addEventListener('error', function(e) {
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: e.message + ' at ' + e.filename + ':' + e.lineno
            }, '*');
          });

          window.addEventListener('load', function() {
            window.parent.postMessage({ type: 'loaded' }, '*');
          });
        })();
      </script>
    `;

    // Inject the script before </head> or at the start of <body>
    let modifiedHtml = indexHtml;
    if (modifiedHtml.includes('</head>')) {
      modifiedHtml = modifiedHtml.replace('</head>', `${consoleScript}</head>`);
    } else if (modifiedHtml.includes('<body>')) {
      modifiedHtml = modifiedHtml.replace('<body>', `<body>${consoleScript}`);
    } else {
      modifiedHtml = consoleScript + modifiedHtml;
    }

    iframeRef.current.srcdoc = modifiedHtml;
    setTimeout(() => setLoading(false), 300);
  }, [vfs, previewKey]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        addConsoleLog({
          type: event.data.level,
          message: event.data.message,
        });
      } else if (event.data?.type === 'loaded') {
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addConsoleLog]);

  const handleOpenInNewTab = () => {
    const files = vfs.getAllFiles();
    const indexHtml = files.get('/index.html') || '';
    const blob = new Blob([indexHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleRefresh = () => {
    setLoading(true);
    refreshPreview();
  };

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 glass border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Live Preview</h3>
          {loading && (
            <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-smooth"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-smooth"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm animate-fadeIn">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-300">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-scripts allow-forms allow-modals"
          title="Preview"
        />
      </div>
    </div>
  );
}
