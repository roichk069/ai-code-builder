'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Layout } from 'lucide-react';
import { TemplateSelector } from './template-selector';

export function TemplatesModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fadeIn" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(900px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl glass-strong border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Layout className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold">Templates</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-400">
                  Start fast with a prebuilt scaffold
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-smooth"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 max-h-[70vh] overflow-auto">
            <TemplateSelector onSelected={() => onOpenChange(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
