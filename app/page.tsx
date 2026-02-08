'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TemplateSelector } from '@/components/templates/template-selector';
import { Sparkles, Code, Zap, Layout, ArrowRight, Github, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 gradient-mesh overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">AI Code Builder</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/roichk069/ai-code-builder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-smooth"
          >
            <Github className="w-6 h-6" />
          </a>
          <Link href="/editor">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 btn-hover">
              Open Editor
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative container mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-purple-300 text-sm mb-8 animate-fadeIn">
          <Sparkles className="w-4 h-4 animate-pulse-slow" />
          <span className="font-medium">AI-Powered Code Generation</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fadeIn">
          Build Websites with
          <br />
          <span className="text-gradient">
            Natural Language
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fadeIn">
          Describe what you want to build in plain English, and watch AI generate complete,
          production-ready code with live preview in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn">
          <Link href="/editor">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 btn-hover glow-purple">
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 glass hover:bg-white/10 btn-hover"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Layout className="w-5 h-5 mr-2" />
            Browse Templates
          </Button>
        </div>

        {/* Preview Screenshot */}
        <div className="mt-20 rounded-2xl overflow-hidden glass shadow-2xl max-w-5xl mx-auto animate-fadeIn">
          <div className="bg-slate-900/80 backdrop-blur-sm p-4 border-b border-white/10 flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Monitor className="w-4 h-4" />
              <span>AI Code Builder</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="glass p-6 rounded-xl hover:scale-105 transition-smooth">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI Chat</h3>
                <p className="text-gray-400 text-sm">Natural language interface</p>
              </div>
              <div className="glass p-6 rounded-xl hover:scale-105 transition-smooth">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Editor</h3>
                <p className="text-gray-400 text-sm">Monaco code editor</p>
              </div>
              <div className="glass p-6 rounded-xl hover:scale-105 transition-smooth">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Live Preview</h3>
                <p className="text-gray-400 text-sm">Real-time rendering</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      {showTemplates && (
        <div className="relative container mx-auto px-6 pb-24 animate-fadeIn">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Quick Start Templates
          </h2>
          <TemplateSelector />
          <div className="text-center mt-8">
            <Link href="/editor">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 btn-hover">
                Start with a Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="relative container mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Everything You Need to Build Fast
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: 'AI Code Generation',
              description: 'Generate complete, working code from natural language descriptions',
              color: 'from-purple-500 to-purple-600',
            },
            {
              icon: <Code className="w-6 h-6" />,
              title: 'Monaco Editor',
              description: 'VS Code-powered editor with syntax highlighting and IntelliSense',
              color: 'from-blue-500 to-blue-600',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Live Preview',
              description: 'See your changes instantly with real-time preview',
              color: 'from-green-500 to-green-600',
            },
            {
              icon: <Layout className="w-6 h-6" />,
              title: 'Multiple Files',
              description: 'Create and manage complex projects with multiple files',
              color: 'from-orange-500 to-orange-600',
            },
            {
              icon: <Monitor className="w-6 h-6" />,
              title: 'Beautiful Templates',
              description: 'Start with professionally designed templates',
              color: 'from-pink-500 to-pink-600',
            },
            {
              icon: <ArrowRight className="w-6 h-6" />,
              title: 'Export & Deploy',
              description: 'Download your project or deploy with one click',
              color: 'from-indigo-500 to-indigo-600',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="glass p-6 rounded-xl hover:scale-105 transition-smooth card animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative container mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto glass-strong p-12 rounded-3xl">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Start Building?</h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            No credit card required. Start creating amazing websites today.
          </p>
          <Link href="/editor">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-6 btn-hover glow-purple">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>Built with ❤️ using Next.js, TypeScript, and AI</p>
          <p className="text-sm mt-2">
            <a href="https://github.com/roichk069/ai-code-builder" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
