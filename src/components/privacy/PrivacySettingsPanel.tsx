import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip } from '@/components/ui/tooltip';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { SpinnerIcon } from '@/components/icons/SpinnerIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { InfoIcon } from '@/components/icons/InfoIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { cn } from '@/lib/utils';

interface PrivacySettingsPanelProps {
  onMemoryToggle: (setting: 'mood' | 'goals', enabled: boolean) => Promise<void>;
  onSessionForget: () => Promise<void>;
  onDataDownload: () => Promise<void>;
  onHistoryForget: () => Promise<void>;
  className?: string;
}

export const PrivacySettingsPanel = ({
  onMemoryToggle,
  onSessionForget,
  onDataDownload,
  onHistoryForget,
  className,
}: PrivacySettingsPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgetConfirm, setShowForgetConfirm] = useState(false);
  const [showHistoryConfirm, setShowHistoryConfirm] = useState(false);
  const [memorySettings, setMemorySettings] = useState({
    mood: true,
    goals: true,
  });

  const handleMemoryToggle = async (setting: 'mood' | 'goals', enabled: boolean) => {
    setIsLoading(true);
    try {
      await onMemoryToggle(setting, enabled);
      setMemorySettings((prev) => ({ ...prev, [setting]: enabled }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionForget = async () => {
    setIsLoading(true);
    try {
      await onSessionForget();
      setShowForgetConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryForget = async () => {
    setIsLoading(true);
    try {
      await onHistoryForget();
      setShowHistoryConfirm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Privacy Settings</h2>
        </div>
        <p className="text-muted-foreground">
          Control what Claude remembers and how your data is used.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Allow Claude to...</h3>
          {(['mood', 'goals'] as const).map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id={setting}
                  checked={memorySettings[setting]}
                  onCheckedChange={(checked) => handleMemoryToggle(setting, checked)}
                  disabled={isLoading}
                />
                <label
                  htmlFor={setting}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {setting === 'mood' ? 'Remember mood patterns' : 'Track goal progress'}
                </label>
                <Tooltip
                  content={
                    setting === 'mood'
                      ? 'Claude will use your mood history to provide better support'
                      : 'Claude will track your goals to offer relevant suggestions'
                  }
                >
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Forget this session</h3>
              <Tooltip content="Claude will forget everything from this conversation">
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForgetConfirm(true)}
              disabled={isLoading}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Forget Session
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={onDataDownload}
              disabled={isLoading}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download My Data
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowHistoryConfirm(true)}
              disabled={isLoading}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Forget All History
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={showForgetConfirm}
        onOpenChange={setShowForgetConfirm}
        title="Forget This Session?"
        description="Claude will forget everything from this conversation. This action cannot be undone."
        action={
          <Button
            variant="destructive"
            onClick={handleSessionForget}
            disabled={isLoading}
          >
            {isLoading ? (
              <SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4 mr-2" />
            )}
            Forget Session
          </Button>
        }
      />

      <AlertDialog
        open={showHistoryConfirm}
        onOpenChange={setShowHistoryConfirm}
        title="Forget All History?"
        description="This will permanently delete all your conversation history and data. This action cannot be undone."
        action={
          <Button
            variant="destructive"
            onClick={handleHistoryForget}
            disabled={isLoading}
          >
            {isLoading ? (
              <SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4 mr-2" />
            )}
            Forget All History
          </Button>
        }
      />
    </Card>
  );
}; 