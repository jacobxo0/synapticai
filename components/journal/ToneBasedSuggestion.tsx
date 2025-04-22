import React from 'react';
import { useToneContext } from '@/lib/context/ToneContext';
import { useMoodContext } from '@/lib/context/MoodContext';
import { cn } from '@/lib/utils';

interface ToneBasedSuggestionProps {
  className?: string;
}

export const ToneBasedSuggestion: React.FC<ToneBasedSuggestionProps> = ({ className }) => {
  const { currentTone } = useToneContext();
  const { currentMood } = useMoodContext();
  
  const suggestions = {
    supportive: {
      anxious: [
        "What gentle steps might feel right for you to take?",
        "How might you approach this in a way that feels supportive?"
      ],
      sad: [
        "What feels most supportive for you right now?",
        "What small steps feel manageable to explore?"
      ],
      energized: [
        "How might you channel this energy in a way that feels right?",
        "What supportive approaches interest you?"
      ]
    },
    curious: {
      anxious: [
        "What possibilities are you noticing for moving forward?",
        "How might you like to experiment with different perspectives?"
      ],
      sad: [
        "What different approaches feel interesting to explore?",
        "What are you discovering about your preferences?"
      ],
      energized: [
        "What new perspectives might you explore?",
        "How might you experiment with this energy?"
      ]
    },
    direct: {
      anxious: [
        "What specific steps feel most relevant to explore?",
        "What concrete approaches would you like to consider?"
      ],
      sad: [
        "What specific actions feel important to you?",
        "What steps might align with your needs?"
      ],
      energized: [
        "What specific goals would you like to focus on?",
        "What concrete plans feel right to explore?"
      ]
    }
  };

  const currentSuggestions = suggestions[currentTone]?.[currentMood] || [];

  return (
    <div className={cn(
      "transition-all duration-300 ease-in-out",
      "bg-background/50 rounded-lg p-4 mb-4",
      "border border-border/50",
      className
    )}>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {currentSuggestions[0]}
        </p>
        {currentSuggestions[1] && (
          <p className="text-sm text-muted-foreground">
            {currentSuggestions[1]}
          </p>
        )}
      </div>
    </div>
  );
}; 