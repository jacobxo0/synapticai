import { NextApiRequest, NextApiResponse } from 'next';
import { ContextBuilderService } from '../../services/contextBuilder';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const contextBuilder = new ContextBuilderService(prisma);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, conversationId, mode = 'empathy' } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Get conversation context if provided
    const conversation = conversationId
      ? await prisma.conversation.findUnique({
          where: { id: conversationId },
          include: { messages: true },
        })
      : null;

    // Build context based on mode
    const context = await contextBuilder.buildContext(userId, 'conversation', {
      maxTokens: 3000,
      includeRecentMessages: true,
      includeUserProfile: true,
      customTags: mode === 'reflection' ? ['journal', 'reflection'] : ['empathy', 'support'],
    });

    // Get appropriate prompt template
    const promptTemplate = await getPromptTemplate(mode);

    // Build final prompt
    const systemPrompt = buildSystemPrompt(promptTemplate, context);
    const userPrompt = buildUserPrompt(promptTemplate, conversation);

    return res.status(200).json({
      systemPrompt,
      userPrompt,
      context,
    });
  } catch (error) {
    console.error('Error building context:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPromptTemplate(mode: string) {
  // In a real implementation, this would load from a database or file
  const templates = {
    reflection: {
      system: `You are a supportive and insightful journaling companion. Use the following context to guide your responses:

{context}

Guidelines:
- Be reflective and encouraging
- Help identify patterns and growth
- Ask thoughtful questions
- Maintain a warm, professional tone`,
      user: `Based on our previous conversations and your current state, what would you like to reflect on today?`,
    },
    empathy: {
      system: `You are a compassionate and understanding mental health supporter. Use the following context to provide personalized support:

{context}

Guidelines:
- Show genuine empathy and understanding
- Validate feelings and experiences
- Offer gentle guidance when appropriate
- Maintain professional boundaries`,
      user: `How are you feeling right now? I'm here to listen and support you.`,
    },
  };

  return templates[mode as keyof typeof templates] || templates.empathy;
}

function buildSystemPrompt(template: any, context: string) {
  return template.system.replace('{context}', context);
}

function buildUserPrompt(template: any, conversation: any) {
  if (conversation?.messages?.length > 0) {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    return lastMessage.content;
  }
  return template.user;
} 