import { openai } from './openai';
import { logger } from '../utils/logger';

interface JournalScore {
  emotionalDepth: number;
  linguisticClarity: number;
  selfReflection: number;
}

interface ScoringCriteria {
  emotionalDepth: {
    indicators: string[];
    weights: number[];
  };
  linguisticClarity: {
    indicators: string[];
    weights: number[];
  };
  selfReflection: {
    indicators: string[];
    weights: number[];
  };
}

const SCORING_CRITERIA: ScoringCriteria = {
  emotionalDepth: {
    indicators: [
      'emotional vocabulary',
      'intensity of feelings',
      'emotional complexity',
      'emotional transitions',
      'vulnerability'
    ],
    weights: [0.3, 0.25, 0.2, 0.15, 0.1]
  },
  linguisticClarity: {
    indicators: [
      'sentence structure',
      'vocabulary precision',
      'coherence',
      'grammar',
      'flow'
    ],
    weights: [0.25, 0.25, 0.2, 0.15, 0.15]
  },
  selfReflection: {
    indicators: [
      'insight depth',
      'pattern recognition',
      'personal growth',
      'perspective shifts',
      'action orientation'
    ],
    weights: [0.3, 0.25, 0.2, 0.15, 0.1]
  }
};

export const scoreJournalEntry = async (entry: string): Promise<JournalScore> => {
  try {
    // Split entry into manageable chunks for analysis
    const chunks = splitIntoChunks(entry, 1000);
    
    // Analyze each chunk
    const chunkScores = await Promise.all(
      chunks.map(chunk => analyzeChunk(chunk))
    );
    
    // Aggregate scores
    return aggregateScores(chunkScores);
  } catch (error) {
    logger.error('Error scoring journal entry:', error);
    return {
      emotionalDepth: 0,
      linguisticClarity: 0,
      selfReflection: 0
    };
  }
};

const splitIntoChunks = (text: string, maxLength: number): string[] => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
};

const analyzeChunk = async (chunk: string): Promise<JournalScore> => {
  const prompt = createAnalysisPrompt(chunk);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an expert journal analysis system. Analyze the following journal entry chunk and provide scores for emotional depth, linguistic clarity, and self-reflection. Return only a JSON object with these three scores (0-1).'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 150
  });
  
  try {
    const scores = JSON.parse(response.choices[0].message.content);
    return validateScores(scores);
  } catch (error) {
    logger.error('Error parsing analysis response:', error);
    return {
      emotionalDepth: 0,
      linguisticClarity: 0,
      selfReflection: 0
    };
  }
};

const createAnalysisPrompt = (chunk: string): string => {
  return `
Analyze this journal entry chunk according to the following criteria:

${Object.entries(SCORING_CRITERIA).map(([category, { indicators, weights }]) => `
${category}:
${indicators.map((indicator, i) => `- ${indicator} (weight: ${weights[i]})`).join('\n')}
`).join('\n')}

Entry chunk:
${chunk}

Provide scores (0-1) for each category based on the weighted criteria.
`;
};

const aggregateScores = (chunkScores: JournalScore[]): JournalScore => {
  return {
    emotionalDepth: average(chunkScores.map(s => s.emotionalDepth)),
    linguisticClarity: average(chunkScores.map(s => s.linguisticClarity)),
    selfReflection: average(chunkScores.map(s => s.selfReflection))
  };
};

const average = (numbers: number[]): number => {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

const validateScores = (scores: any): JournalScore => {
  const validated: JournalScore = {
    emotionalDepth: clamp(scores.emotionalDepth || 0),
    linguisticClarity: clamp(scores.linguisticClarity || 0),
    selfReflection: clamp(scores.selfReflection || 0)
  };
  
  return validated;
};

const clamp = (value: number): number => {
  return Math.max(0, Math.min(1, value));
}; 