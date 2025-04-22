import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { AppError } from '@/lib/errors';

const PromptTemplateSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  variables: z.array(z.string()),
  context: z.record(z.any()).optional(),
});

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;

export class PromptService {
  private static instance: PromptService;

  private constructor() {}

  public static getInstance(): PromptService {
    if (!PromptService.instance) {
      PromptService.instance = new PromptService();
    }
    return PromptService.instance;
  }

  async createTemplate(template: Omit<PromptTemplate, 'id'>) {
    try {
      const validated = await PromptTemplateSchema.parseAsync(template);
      return await prisma.promptTemplate.create({
        data: validated,
      });
    } catch (error) {
      throw new AppError(400, 'Invalid prompt template', 'INVALID_TEMPLATE');
    }
  }

  async getTemplate(name: string) {
    const template = await prisma.promptTemplate.findUnique({
      where: { name },
    });

    if (!template) {
      throw new AppError(404, 'Prompt template not found', 'TEMPLATE_NOT_FOUND');
    }

    return template;
  }

  async generatePrompt(name: string, variables: Record<string, string>) {
    const template = await this.getTemplate(name);

    // Validate all required variables are provided
    const missingVariables = template.variables.filter(
      (v) => !(v in variables)
    );
    if (missingVariables.length > 0) {
      throw new AppError(
        400,
        `Missing required variables: ${missingVariables.join(', ')}`,
        'MISSING_VARIABLES'
      );
    }

    // Replace variables in template
    let prompt = template.content;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    return prompt;
  }

  async updateTemplate(name: string, updates: Partial<PromptTemplate>) {
    try {
      const validated = await PromptTemplateSchema.partial().parseAsync(updates);
      return await prisma.promptTemplate.update({
        where: { name },
        data: validated,
      });
    } catch (error) {
      throw new AppError(400, 'Invalid template updates', 'INVALID_UPDATES');
    }
  }

  async deleteTemplate(name: string) {
    try {
      await prisma.promptTemplate.delete({
        where: { name },
      });
    } catch (error) {
      throw new AppError(404, 'Template not found', 'TEMPLATE_NOT_FOUND');
    }
  }
}

export const promptService = PromptService.getInstance(); 