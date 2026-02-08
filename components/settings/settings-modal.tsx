'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { X, Settings, Key, Sparkles, ExternalLink, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey, selectedModel, setSelectedModel } = useStore();
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(selectedModel);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalModel(selectedModel);
  }, [apiKey, selectedModel]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setSelectedModel(localModel);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const isApiKeyValid = localApiKey.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-strong rounded-2xl w-full max-w-lg mx-4 p-6 shadow-2xl animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg text-gray-400 hover:text-white transition-smooth"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" />
                OpenRouter API Key
              </div>
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full bg-slate-800/80 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-smooth placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-xs text-gray-500">
                Your API key is stored locally in your browser and never sent to our servers.
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Don't have a key?</p>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Get one from OpenRouter
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI Model
              </div>
            </label>
            <select
              value={localModel}
              onChange={(e) => setLocalModel(e.target.value)}
              className="w-full bg-slate-800/80 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-smooth cursor-pointer"
            >
              <option value="anthropic/claude-3.5-sonnet">
                Claude 3.5 Sonnet (Recommended)
              </option>
              <option value="anthropic/claude-3-opus">
                Claude 3 Opus (Most Capable)
              </option>
              <option value="openai/gpt-4-turbo">
                GPT-4 Turbo
              </option>
              <option value="openai/gpt-4">
                GPT-4
              </option>
              <option value="openai/gpt-3.5-turbo">
                GPT-3.5 Turbo (Fastest & Cheapest)
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Different models have different capabilities and pricing. Claude 3.5 Sonnet offers the best balance.
            </p>
          </div>

          {/* Connection Status */}
          {isApiKeyValid && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">API key configured</span>
              </div>
              <p className="text-xs text-green-300/70 mt-1">
                You're all set to start building with AI!
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
          <Button
            onClick={handleSave}
            disabled={!isApiKeyValid || saved}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 font-semibold btn-hover"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6 py-3 border-white/20 hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
