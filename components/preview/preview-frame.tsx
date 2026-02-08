'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { RefreshCw, ExternalLink } from 'lucide-react';

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { vfs, previewKey, refreshPreview, addConsoleLog } = useStore();

  useEffect(() => {
    if (!iframeRef.current) return;

    const files = vfs.getAllFiles();
    const indexHtml = files.get('/index.html') || '';

    if (!indexHtml) {
      // Show empty state
      const emptyHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: system-ui, -apple-system, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .container {
                text-align: center;
              }
              h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
              }
              p {
                font-size: 1.1rem;
                opacity: 0.9;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✨ Preview</h1>
              <p>Your app will appear here once you generate some code</p>
            </div>
          </body>
        </html>
      `;
      iframeRef.current.srcdoc = emptyHtml;
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
  }, [vfs, previewKey]);

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        addConsoleLog({
          type: event.data.level,
          message: event.data.message,
        });
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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshPreview}
            className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-white"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 hover:bg-slate-700 rounded text-gray-400 hover:text-white"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
        title="Preview"
      />
    </div>
  );
}
