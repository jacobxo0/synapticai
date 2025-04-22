'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardData {
  todoCount: number;
  completedTodoCount: number;
  activeGoals: number;
  latestMood?: { mood: number; note: string };
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/dashboard')
        .then((res) => res.json())
        .then(setData);
    }
  }, [session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {session.user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          {data && (
            <div>
              <p className="text-gray-600">
                {data.completedTodoCount} of {data.todoCount} tasks completed
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full"
                  style={{
                    width: `${(data.completedTodoCount / data.todoCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Goals</h2>
          {data && (
            <p className="text-gray-600">
              {data.activeGoals} active goals
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Latest Mood</h2>
          {data?.latestMood && (
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl">
                  {data.latestMood.mood >= 7 ? '😊' : 
                   data.latestMood.mood >= 4 ? '😐' : '😔'}
                </span>
                <span className="ml-2 text-gray-600">
                  Score: {data.latestMood.mood}/10
                </span>
              </div>
              {data.latestMood.note && (
                <p className="text-gray-600 text-sm">{data.latestMood.note}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 