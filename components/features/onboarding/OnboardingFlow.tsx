import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Mind Mate',
      description: 'Your personal AI companion for mental wellness',
      component: <WelcomeStep />,
    },
    {
      id: 'mood',
      title: 'Track Your Mood',
      description: 'Start by sharing how you feel today',
      component: <MoodStep />,
    },
    {
      id: 'journal',
      title: 'Journal Your Thoughts',
      description: 'Take a moment to reflect and write',
      component: <JournalStep />,
    },
    {
      id: 'ai-intro',
      title: 'Meet Claude',
      description: 'Your AI companion is ready to chat',
      component: <AIIntroStep />,
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await api.post('/api/onboarding/complete', {
        steps: steps.map(step => step.id),
      });
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
            {steps[currentStep].component}
            <div className="flex justify-between mt-6">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}

function WelcomeStep() {
  return (
    <div className="space-y-4">
      <p className="text-lg text-muted-foreground">
        Let&apos;s get started on your journey to better mental health. We&apos;ll help you set up your profile and preferences.
      </p>
      <p className="text-sm text-muted-foreground">
        Don&apos;t worry, you can always change these settings later.
      </p>
    </div>
  );
}

function MoodStep() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {['😢', '😞', '😐', '😊', '😄'].map((emoji, index) => (
          <button
            key={index}
            className={`p-4 rounded-lg text-2xl transition-colors ${
              selectedMood === emoji ? 'bg-primary/20' : 'hover:bg-muted'
            }`}
            onClick={() => setSelectedMood(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

function JournalStep() {
  const [entry, setEntry] = useState('');

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-32 p-3 rounded-lg border bg-background"
        placeholder="How are you feeling today? What's on your mind?"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
    </div>
  );
}

function AIIntroStep() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Claude is your AI companion who&apos;s here to listen, support, and help you reflect on your thoughts and feelings.
      </p>
      <p className="text-muted-foreground">
        You can chat with Claude anytime about anything that&apos;s on your mind.
      </p>
    </div>
  );
} 