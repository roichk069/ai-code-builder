'use client';

import { templates } from '@/lib/templates';
import { useStore } from '@/lib/store';
import { Sparkles } from 'lucide-react';

export function TemplateSelector() {
  const { loadTemplate } = useStore();

  const handleSelectTemplate = (templateFiles: Record<string, string>) => {
    loadTemplate(templateFiles);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleSelectTemplate(template.files)}
          className="group text-left p-6 bg-slate-800 rounded-lg border border-white/10 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{template.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
