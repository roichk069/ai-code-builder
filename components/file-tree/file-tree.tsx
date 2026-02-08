'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { FileNode } from '@/lib/fs';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Trash2, FileCode, FileText } from 'lucide-react';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { currentFile, setCurrentFile, deleteFile } = useStore();

  const isSelected = currentFile === node.path;

  const handleClick = () => {
    if (node.type === 'file') {
      setCurrentFile(node.path);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'file' && confirm(`Delete ${node.name}?`)) {
      deleteFile(node.path);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconClass = "w-4 h-4 flex-shrink-0";
    
    switch (ext) {
      case 'html':
        return <FileCode className={`${iconClass} text-orange-400`} />;
      case 'css':
        return <FileCode className={`${iconClass} text-blue-400`} />;
      case 'js':
      case 'jsx':
        return <FileCode className={`${iconClass} text-yellow-400`} />;
      case 'ts':
      case 'tsx':
        return <FileCode className={`${iconClass} text-blue-500`} />;
      case 'json':
        return <FileText className={`${iconClass} text-green-400`} />;
      default:
        return <File className={`${iconClass} text-gray-400`} />;
    }
  };

  return (
    <div className="animate-fadeIn">
      <div
        className={`flex items-center gap-2 px-2 py-1.5 mx-1 cursor-pointer rounded-lg group transition-smooth ${
          isSelected 
            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-white border border-purple-500/30' 
            : 'text-gray-300 hover:bg-slate-800/50 hover:border hover:border-white/10'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'directory' ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="flex-1 truncate text-sm font-medium">{node.name}</span>
        {node.type === 'file' && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-smooth"
            title="Delete file"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        )}
      </div>
      {node.type === 'directory' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  const { vfs, updateFile } = useStore();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFile, setShowNewFile] = useState(false);

  const fileTree = vfs.getFileTree();

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const path = newFileName.startsWith('/') ? newFileName : `/${newFileName}`;
      updateFile(path, '');
      setNewFileName('');
      setShowNewFile(false);
    }
  };

  return (
    <div className="h-full bg-slate-900/50 backdrop-blur-sm flex flex-col">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Folder className="w-4 h-4 text-purple-400" />
          Files
        </h3>
        <button
          onClick={() => setShowNewFile(!showNewFile)}
          className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-smooth glass-hover"
          title="New file"
        >
          <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
        </button>
      </div>

      {showNewFile && (
        <div className="p-2 border-b border-white/10 animate-fadeIn">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFile();
              if (e.key === 'Escape') setShowNewFile(false);
            }}
            onBlur={() => {
              if (!newFileName.trim()) setShowNewFile(false);
            }}
            placeholder="/newfile.html"
            className="w-full bg-slate-800/80 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-smooth"
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">Press Enter to create, Esc to cancel</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {fileTree.children && fileTree.children.length > 0 ? (
          fileTree.children.map((node) => <FileTreeItem key={node.path} node={node} level={0} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Folder className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-500 text-sm mb-2">No files yet</p>
            <p className="text-gray-600 text-xs">
              Start by chatting with AI or create a new file
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
