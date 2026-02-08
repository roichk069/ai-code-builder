'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { generateCode } from '@/lib/ai';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatInterface() {
  const [input, setInput] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isGenerating) return;

    if (!apiKey) {
      alert('Please set your API key first (click the settings icon in the top right)');
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
    } catch (error) {
      console.error('Error generating code:', error);
      addMessage({
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to generate code'}`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Describe what you want to build and I&apos;ll generate the code
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-16 h-16 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Building Something Amazing
            </h3>
            <p className="text-gray-400 max-w-md">
              Tell me what you want to create, and I&apos;ll generate the code for you.
              Try starting with a template or describe your project!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-gray-100 border border-white/10'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-slate-800 text-gray-100 border border-white/10">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating code...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10"
            disabled={isGenerating}
          />
          <Button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
