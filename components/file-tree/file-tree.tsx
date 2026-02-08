'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { FileNode } from '@/lib/fs';
import { File, Folder, FolderOpen, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';

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

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-700/50 rounded group ${
          isSelected ? 'bg-purple-600/30 text-purple-300' : 'text-gray-300'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'directory' ? (
          <>
            {isOpen ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 flex-shrink-0 text-blue-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="w-4 h-4 flex-shrink-0 text-gray-400" />
          </>
        )}
        <span className="flex-1 truncate text-sm">{node.name}</span>
        {node.type === 'file' && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
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
    <div className="h-full bg-slate-900 border-r border-white/10">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Files</h3>
        <button
          onClick={() => setShowNewFile(!showNewFile)}
          className="p-1 hover:bg-slate-700 rounded"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {showNewFile && (
        <div className="p-2 border-b border-white/10">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFile()}
            placeholder="/newfile.html"
            className="w-full bg-slate-800 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
            autoFocus
          />
        </div>
      )}

      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {fileTree.children && fileTree.children.length > 0 ? (
          fileTree.children.map((node) => <FileTreeItem key={node.path} node={node} level={0} />)
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No files yet. Start by selecting a template or chat with AI!
          </div>
        )}
      </div>
    </div>
  );
}
