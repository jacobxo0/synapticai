import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoalSuggestions } from '@/hooks/useGoalSuggestions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SpinnerIcon } from '@/components/icons/SpinnerIcon';
import { XIcon } from '@/components/icons/XIcon';
import { PlusIcon } from '@/components/icons/PlusIcon';
import { cn } from '@/lib/utils';

interface GoalSuggestionProps {
  context: string;
  onClose: () => void;
  className?: string;
}

export const GoalSuggestion = ({
  context,
  onClose,
  className,
}: GoalSuggestionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const {
    suggestions,
    isLoading,
    error,
    fetchSuggestions,
    addSuggestion,
    clearSuggestions,
  } = useGoalSuggestions();

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleAddGoal = (suggestion: typeof suggestions[0]) => {
    addSuggestion(suggestion);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'fixed inset-0 flex items-center justify-center p-4',
            className
          )}
        >
          <div
            className="fixed inset-0 bg-black/50"
            onClick={handleClose}
            aria-hidden="true"
          />
          <Card className="relative z-10 w-full max-w-2xl bg-background p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Goal Suggestions</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                aria-label="Close suggestions"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <SpinnerIcon className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading suggestions...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">
                <p>{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchSuggestions(context)}
                >
                  Try Again
                </Button>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No suggestions available. Try again later.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => fetchSuggestions(context)}
                >
                  Refresh
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start justify-between p-4 rounded-lg border"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {suggestion.tone}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddGoal(suggestion)}
                      className="ml-4"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 