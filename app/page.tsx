'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Welcome to SynapticAI
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Your personal AI assistant to help you manage tasks, track goals, monitor mood, and chat intelligently.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <button
          onClick={() => signIn('github')}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Get started
        </button>
      </div>
    </div>
  );
} 