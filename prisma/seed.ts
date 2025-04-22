import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      todos: {
        create: [
          {
            title: 'Learn Next.js',
            completed: false,
          },
          {
            title: 'Build a Todo App',
            completed: true,
          },
          {
            title: 'Master TypeScript',
            completed: false,
          },
        ],
      },
    },
  });

  // Create a test goal
  const goal = await prisma.goal.create({
    data: {
      title: 'Learn Next.js',
      description: 'Master Next.js and build amazing applications',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: user.id,
    },
  });

  // Create a test conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: 'First Chat',
      userId: user.id,
      messages: {
        create: [
          {
            content: 'Hello! How can I help you today?',
            role: 'assistant',
            userId: user.id,
          },
          {
            content: 'I want to learn about AI',
            role: 'user',
            userId: user.id,
          },
        ],
      },
    },
  });

  // Create a test mood log
  const moodLog = await prisma.moodLog.create({
    data: {
      mood: 8,
      note: 'Feeling productive today!',
      userId: user.id,
    },
  });

  console.log('Test data created:', {
    user: { id: user.id, email: user.email },
    goal: { id: goal.id, title: goal.title },
    conversation: { id: conversation.id, title: conversation.title },
    moodLog: { id: moodLog.id, mood: moodLog.mood },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 