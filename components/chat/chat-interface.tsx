'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { generateCode } from '@/lib/ai';
import { Send, Loader2, Sparkles, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  onOpenSettings?: () => void;
}

export function ChatInterface({ onOpenSettings }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    addMessage,
    isGenerating,
    setIsGenerating,
    vfs,
    updateFile,
    apiKey,
    selectedModel,
  } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim() || isGenerating) return;

    // Check for API key
    if (!apiKey) {
      setError('API key not configured');
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addMessage({ role: 'user', content: userMessage });
    setIsGenerating(true);

    try {
      const currentFiles = vfs.getAllFiles();
      const response = await generateCode(userMessage, currentFiles, apiKey, selectedModel);

      // Add AI response
      addMessage({ role: 'assistant', content: response.message });

      // Update files if any were generated
      if (response.files && response.files.length > 0) {
        response.files.forEach((file) => {
          updateFile(file.path, file.content);
        });
      }
    } catch (error: any) {
      console.error('Error generating code:', error);
      let errorMessage = 'Failed to generate code. Please try again.';

      if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMessage = 'Invalid API key. Please check your settings.';
      } else if (error.message?.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: `❌ **Error:** ${errorMessage}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <div className="relative p-4 border-b border-white/10 glass backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-gray-400">
              Powered by {selectedModel.split('/')[1]?.replace(/-/g, ' ').toUpperCase() || 'Claude'}
            </p>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="relative bg-red-500/10 border-b border-red-500/30 px-4 py-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300 font-medium">{error}</p>
              {error.includes('API key') && (
                <button
                  onClick={onOpenSettings}
                  className="text-xs text-red-400 hover:text-red-300 underline mt-1 inline-flex items-center gap-1"
                >
                  <SettingsIcon className="w-3 h-3" />
                  Open Settings
                </button>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !apiKey && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-6 animate-pulse-slow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Welcome to AI Code Builder!
            </h3>
            <p className="text-gray-400 max-w-sm mb-6">
              To get started, you'll need to configure your OpenRouter API key.
            </p>
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium btn-hover"
            >
              <SettingsIcon className="w-4 h-4" />
              Configure API Key
            </button>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 mt-4 underline"
            >
              Get API Key from OpenRouter →
            </a>
          </div>
        )}

        {messages.length === 0 && apiKey && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Building Something Amazing
            </h3>
            <p className="text-gray-400 max-w-md">
              Describe what you want to create, and I'll generate the code for you.
              Try starting with a template or describe your project!
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-500">Try something like:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Create a landing page',
                  'Build a todo app',
                  'Make a calculator',
                  'Design a portfolio',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-1.5 text-sm bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 rounded-lg border border-white/10 hover:border-purple-500/50 transition-smooth"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.length > 0 && messages.map((message) => (
          <div
            key={message.id}
            className={`flex animate-fadeIn ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'glass text-gray-100 shadow-xl'
              }`}
            >
              <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
              </div>
              <div className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start animate-fadeIn">
            <div className="max-w-[85%] glass rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-gray-300">Generating code...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="relative p-4 border-t border-white/10 glass backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={apiKey ? "Describe what you want to build..." : "Configure your API key first..."}
              className="w-full bg-slate-800/80 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 placeholder:text-gray-600 transition-smooth"
              disabled={isGenerating || !apiKey}
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            )}
          </div>
          <Button
            type="submit"
            disabled={isGenerating || !input.trim() || !apiKey}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 btn-hover"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        {!apiKey && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            <button
              onClick={onOpenSettings}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Add your API key
            </button>
            {' '}to start building with AI
          </p>
        )}
      </div>
    </div>
  );
}
