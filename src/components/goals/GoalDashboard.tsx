import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GoalSuggestion } from './GoalSuggestion';

export type GoalStatus = 'active' | 'paused' | 'completed';

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
  tone?: {
    type: 'supportive' | 'reflective' | 'encouraging' | 'analytical';
    mood: number;
  };
}

interface GoalDashboardProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onStatusChange: (goalId: string, status: GoalStatus) => void;
  onDelete: (goalId: string) => void;
  className?: string;
}

const STATUS_STYLES = {
  active: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
  },
  paused: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  completed: {
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-800',
  },
};

export const GoalDashboard: React.FC<GoalDashboardProps> = ({
  goals,
  onEdit,
  onStatusChange,
  onDelete,
  className,
}) => {
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    onEdit(goal);
  };

  const handleStatusChange = (goalId: string, status: GoalStatus) => {
    onStatusChange(goalId, status);
  };

  const handleDelete = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      onDelete(goalId);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Goals</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Add Goal
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'p-4 rounded-lg border',
                STATUS_STYLES[goal.status].bg,
                STATUS_STYLES[goal.status].border
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{goal.title}</h3>
                <span
                  className={cn(
                    'px-2 py-1 text-xs rounded-full',
                    STATUS_STYLES[goal.status].bg,
                    STATUS_STYLES[goal.status].text
                  )}
                >
                  {goal.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {goal.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(goal)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(
                      goal.id,
                      goal.status === 'active' ? 'paused' : 'active'
                    )
                  }
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  {goal.status === 'active' ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAddModal && (
        <GoalSuggestion
          onClose={() => setShowAddModal(false)}
          onAdd={(goal) => {
            // Handle goal addition
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}; 