'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Sparkles, Key, Rocket, Code, Zap, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { setApiKey, setHasSeenWelcome, setSelectedModel } = useStore();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selectedModelInput, setSelectedModelInput] = useState('anthropic/claude-3.5-sonnet');
  const [showApiKey, setShowApiKey] = useState(false);
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2 && apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setSelectedModel(selectedModelInput);
      setHasSeenWelcome(true);
      onComplete();
    }
  };

  const handleSkip = () => {
    setHasSeenWelcome(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 gradient-mesh">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      
      <div className="relative w-full max-w-2xl mx-4 animate-fadeIn">
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          {step === 1 ? (
            <>
              {/* Step 1: Welcome */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6 animate-pulse-slow">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  Welcome to AI Code Builder
                </h1>
                <p className="text-xl text-gray-300">
                  Build beautiful web applications with the power of AI
                </p>
              </div>

              <div className="grid gap-4 mb-8">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-purple-500/50 transition-smooth">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">AI-Powered Development</h3>
                    <p className="text-sm text-gray-400">
                      Describe what you want to build, and let AI generate the code for you
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-blue-500/50 transition-smooth">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Real-Time Preview</h3>
                    <p className="text-sm text-gray-400">
                      See your changes instantly with live preview and hot reload
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-green-500/50 transition-smooth">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Export & Deploy</h3>
                    <p className="text-sm text-gray-400">
                      Download your project as a ZIP file and deploy anywhere
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleContinue}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold btn-hover"
                >
                  Get Started
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="px-8 py-6 text-lg border-white/20 hover:bg-white/5"
                >
                  Skip
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: API Key Setup */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Configure Your API Key
                </h2>
                <p className="text-gray-300">
                  Add your OpenRouter API key to start building with AI
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    OpenRouter API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk-or-v1-..."
                      className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-smooth"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    AI Model
                  </label>
                  <select
                    value={selectedModelInput}
                    onChange={(e) => setSelectedModelInput(e.target.value)}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/10 transition-smooth"
                  >
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Recommended)</option>
                    <option value="anthropic/claude-3-opus">Claude 3 Opus</option>
                    <option value="openai/gpt-4-turbo">GPT-4 Turbo</option>
                    <option value="openai/gpt-4">GPT-4</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo (Fastest)</option>
                  </select>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-300 mb-2">
                    <strong>Don't have an API key?</strong>
                  </p>
                  <p className="text-sm text-blue-200 mb-3">
                    Get your free API key from OpenRouter in just a few clicks.
                  </p>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Get API Key
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="px-8 py-6 text-lg border-white/20 hover:bg-white/5"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinue}
                  disabled={!apiKeyInput.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-6 text-lg font-semibold btn-hover"
                >
                  Start Building
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="px-8 py-6 text-lg border-white/20 hover:bg-white/5"
                >
                  Skip
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-4">
                You can always add your API key later in the settings
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
