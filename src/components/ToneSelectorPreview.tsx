import { motion } from 'framer-motion';
import { useToneStore, Tone } from '../stores/useToneStore';
import { trackEvent } from '../utils/analytics';

interface ToneConfig {
  label: string;
  description: string;
  color: string;
}

const TONE_CONFIG: Record<Tone, ToneConfig> = {
  supportive: {
    label: 'Supportive',
    description: 'Warm and encouraging, focusing on emotional support and gentle guidance',
    color: 'bg-emerald-100 border-emerald-500 text-emerald-800',
  },
  direct: {
    label: 'Direct',
    description: 'Clear and straightforward, providing concise and actionable advice',
    color: 'bg-blue-100 border-blue-500 text-blue-800',
  },
  curious: {
    label: 'Curious',
    description: 'Inquisitive and exploratory, asking thoughtful questions to deepen understanding',
    color: 'bg-purple-100 border-purple-500 text-purple-800',
  },
} as const;

interface ToneSelectorPreviewProps {
  className?: string;
  onToneChange?: (tone: Tone) => void;
}

export const ToneSelectorPreview: React.FC<ToneSelectorPreviewProps> = ({
  className,
  onToneChange,
}) => {
  const { currentTone, setTone } = useToneStore();

  const handleToneSelect = (tone: Tone) => {
    setTone(tone);
    trackEvent('tone.selected', { tone });
    onToneChange?.(tone);
  };

  return (
    <div 
      className={`space-y-4 ${className || ''}`}
      role="radiogroup"
      aria-label="Select conversation tone"
    >
      <h2 className="text-xl font-semibold text-gray-800">Select Conversation Tone</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(TONE_CONFIG) as Tone[]).map((tone) => {
          const config = TONE_CONFIG[tone];
          const isSelected = currentTone === tone;

          return (
            <motion.button
              key={tone}
              onClick={() => handleToneSelect(tone)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200
                ${config.color}
                ${isSelected ? 'ring-2 ring-offset-2 ring-gray-400' : 'hover:shadow-md'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Select ${config.label} tone`}
              aria-describedby={`tone-${tone}-description`}
            >
              <h3 className="font-medium mb-2">{config.label}</h3>
              <p 
                id={`tone-${tone}-description`}
                className="text-sm opacity-90"
              >
                {config.description}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}; 