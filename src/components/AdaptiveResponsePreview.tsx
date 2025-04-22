import { motion } from 'framer-motion';
import { useToneStore } from '../stores/useToneStore';
import { InfoIcon } from './icons/InfoIcon';

interface AdaptiveResponsePreviewProps {
  mood: number;
  entry: string;
  onRefresh?: () => void;
  className?: string;
}

type Tone = 'supportive' | 'direct' | 'curious';
type MoodCategory = 'high' | 'medium' | 'low';

const PREVIEW_RESPONSES: Record<Tone, Record<MoodCategory, string[]>> = {
  supportive: {
    high: [
      "I can see you're feeling really positive about this!",
      "It's wonderful to hear about your uplifting experience.",
      "Your enthusiasm is contagious!",
    ],
    medium: [
      "I appreciate you sharing this with me.",
      "Let's explore this together.",
      "I'm here to support you through this.",
    ],
    low: [
      "I hear the challenges you're facing.",
      "It's okay to feel this way.",
      "I'm here to help you work through this.",
    ],
  },
  direct: {
    high: [
      "Great progress! Let's build on this momentum.",
      "Your positive outlook is a strong foundation.",
      "This is a solid step forward.",
    ],
    medium: [
      "Let's break this down into actionable steps.",
      "What specific aspects would you like to focus on?",
      "Here's what I'm seeing from your entry.",
    ],
    low: [
      "Let's address these challenges head-on.",
      "What's the first step you'd like to take?",
      "Here's a clear path forward.",
    ],
  },
  curious: {
    high: [
      "What made this experience particularly meaningful for you?",
      "How did this positive moment come about?",
      "What insights did you gain from this?",
    ],
    medium: [
      "What aspects of this would you like to explore further?",
      "How does this connect to your broader journey?",
      "What patterns do you notice here?",
    ],
    low: [
      "What's beneath these feelings?",
      "How might we reframe this situation?",
      "What possibilities haven't we considered yet?",
    ],
  },
} as const;

export const AdaptiveResponsePreview: React.FC<AdaptiveResponsePreviewProps> = ({
  mood,
  entry,
  onRefresh,
  className,
}) => {
  const { currentTone } = useToneStore();
  
  // Determine mood category
  const moodCategory: MoodCategory = mood >= 7 ? 'high' : mood >= 4 ? 'medium' : 'low';
  
  // Get random response based on tone and mood
  const responses = PREVIEW_RESPONSES[currentTone as Tone][moodCategory];
  const previewResponse = responses[Math.floor(Math.random() * responses.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className || ''}`}
      role="region"
      aria-label="Response preview"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Preview Response</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-800"
            aria-label="Refresh preview"
            disabled={!onRefresh}
          >
            Refresh
          </button>
          <div className="group relative">
            <InfoIcon 
              className="w-4 h-4 text-gray-400 hover:text-gray-600" 
              aria-label="Information about preview"
            />
            <div 
              className="absolute right-0 w-64 p-2 mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              role="tooltip"
              aria-label="Preview information"
            >
              This preview shows how Claude might respond based on your current tone setting and mood level. The actual response may vary.
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="bg-gray-50 rounded-lg p-3 text-gray-800"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm">{previewResponse}</p>
      </div>
    </motion.div>
  );
}; 