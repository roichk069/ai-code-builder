'use client';

import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '@/lib/store';

export function CodeEditor() {
  const { currentFile, vfs, updateFile } = useStore();
  const editorRef = useRef<any>(null);

  const currentContent = currentFile ? vfs.getFile(currentFile) : '';

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFile(currentFile, value);
    }
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">No file selected</p>
          <p className="text-sm">Select a file from the tree or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={getLanguage(currentFile)}
      value={currentContent}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}
