import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const SHORTCUTS = [
  {
    key: 'j',
    description: 'Open journal',
    category: 'Navigation',
  },
  {
    key: 'm',
    description: 'Track mood',
    category: 'Navigation',
  },
  {
    key: 'c',
    description: 'Chat with Claude',
    category: 'Navigation',
  },
  {
    key: '?',
    description: 'Show shortcuts',
    category: 'Help',
  },
  {
    key: 'esc',
    description: 'Close modal',
    category: 'Navigation',
  },
];

interface ShortcutManagerProps {
  className?: string;
  onClose?: () => void;
}

export function ShortcutManager({ className, onClose }: ShortcutManagerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn('rounded-lg bg-card p-6 shadow-lg', className)}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close shortcuts"
          >
            ×
          </Button>
        </div>

        <div className="grid gap-4">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
            >
              <div>
                <div className="font-medium">{shortcut.description}</div>
                <div className="text-sm text-muted-foreground">
                  {shortcut.category}
                </div>
              </div>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded-md">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">?</kbd> to show this help at any time
          </p>
        </div>
      </div>
    </motion.div>
  );
} 