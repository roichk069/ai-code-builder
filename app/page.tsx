'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TemplateSelector } from '@/components/templates/template-selector';
import { Sparkles, Code, Zap, Layout, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">AI Code Builder</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-6 h-6" />
          </a>
          <Link href="/editor">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Open Editor
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Code Generation</span>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Build Websites with
          <br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Natural Language
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Describe what you want to build in plain English, and watch AI generate complete,
          production-ready code with live preview in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/editor">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8">
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 border-white/20 hover:bg-white/10"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layout className="w-5 h-5 mr-2" />
            Browse Templates
          </Button>
        </div>

        {/* Screenshot/Preview */}
        <div className="mt-16 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <div className="bg-slate-900 p-3 border-b border-white/10 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-sm text-gray-400 ml-2">AI Code Builder</span>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-12">
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-slate-950/50 p-6 rounded-lg border border-purple-500/20">
                <Sparkles className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">AI Chat</h3>
                <p className="text-gray-400 text-sm">Natural language interface</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-lg border border-purple-500/20">
                <Code className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Live Editor</h3>
                <p className="text-gray-400 text-sm">Monaco code editor</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-lg border border-purple-500/20">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">Live Preview</h3>
                <p className="text-gray-400 text-sm">Real-time rendering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      {showTemplates && (
        <div className="container mx-auto px-6 pb-24">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Quick Start Templates
          </h2>
          <TemplateSelector />
          <div className="text-center mt-8">
            <Link href="/editor">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Start with a Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Everything You Need to Build Fast
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'AI Code Generation',
              description: 'Generate complete, working code from natural language descriptions',
            },
            {
              icon: <Code className="w-6 h-6" />,
              title: 'Monaco Editor',
              description: 'VS Code-powered editor with syntax highlighting and IntelliSense',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Live Preview',
              description: 'See your changes instantly with real-time preview',
            },
            {
              icon: <Layout className="w-6 h-6" />,
              title: 'Multiple Files',
              description: 'Create and manage complex projects with multiple files',
            },
            {
              icon: '🎨',
              title: 'Beautiful Templates',
              description: 'Start with professionally designed templates',
            },
            {
              icon: '📦',
              title: 'Export & Deploy',
              description: 'Download your project or deploy with one click',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 p-6 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Building?</h2>
        <p className="text-xl text-gray-300 mb-12">
          No credit card required. Start creating amazing websites today.
        </p>
        <Link href="/editor">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-12">
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>Built with Next.js, TypeScript, and AI</p>
        </div>
      </footer>
    </div>
  );
}
