import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { FeedbackCreateInput, FeedbackResponse, FEEDBACK_TAGS } from '../../models/feedback';
import { validateFeedbackInput } from '../../utils/feedbackValidator';
import { logger } from '../../utils/logger';

const prisma = new PrismaClient();

// Queue for failed feedback attempts
const feedbackQueue: FeedbackCreateInput[] = [];
let isProcessingQueue = false;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FeedbackResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const input = req.body as FeedbackCreateInput;
    
    // Validate input
    const validationResult = validateFeedbackInput(input);
    if (!validationResult.isValid) {
      logger.error('Invalid feedback input', { 
        input, 
        errors: validationResult.errors 
      });
      return res.status(400).json({ 
        success: false, 
        error: validationResult.errors.join(', ') 
      });
    }

    // Attempt to save feedback
    const feedback = await saveFeedbackWithRetry(input);
    
    if (!feedback) {
      // If save failed, add to queue
      feedbackQueue.push(input);
      processFeedbackQueue();
      
      return res.status(202).json({ 
        success: true,
        feedback: undefined
      });
    }

    return res.status(200).json({ 
      success: true, 
      feedback 
    });
  } catch (error) {
    logger.error('Feedback API error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}

async function saveFeedbackWithRetry(
  input: FeedbackCreateInput,
  retries = 3
): Promise<FeedbackCreateInput | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Start transaction
      const feedback = await prisma.$transaction(async (tx) => {
        // Create feedback
        const created = await tx.feedback.create({
          data: {
            ...input,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Update session with feedback reference
        await tx.session.update({
          where: { id: input.sessionId },
          data: { 
            feedbackId: created.id,
            updatedAt: new Date()
          },
        });

        return created;
      });

      logger.info('Feedback saved successfully', { 
        feedbackId: feedback.id,
        sessionId: input.sessionId 
      });

      return feedback;
    } catch (error) {
      logger.error(`Feedback save attempt ${attempt} failed`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        sessionId: input.sessionId,
        attempt
      });

      if (attempt === retries) {
        return null;
      }

      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  return null;
}

async function processFeedbackQueue() {
  if (isProcessingQueue || feedbackQueue.length === 0) return;

  isProcessingQueue = true;
  logger.info('Processing feedback queue', { 
    queueLength: feedbackQueue.length 
  });

  try {
    while (feedbackQueue.length > 0) {
      const feedback = feedbackQueue[0];
      const result = await saveFeedbackWithRetry(feedback);

      if (result) {
        feedbackQueue.shift();
        logger.info('Queued feedback saved successfully', {
          feedbackId: result.id,
          sessionId: feedback.sessionId
        });
      } else {
        // If save failed, keep in queue and try again later
        logger.warn('Failed to save queued feedback, will retry later', {
          sessionId: feedback.sessionId
        });
        break;
      }
    }
  } catch (error) {
    logger.error('Error processing feedback queue', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    isProcessingQueue = false;
  }
}

// Process queue every 5 minutes
setInterval(processFeedbackQueue, 5 * 60 * 1000); 