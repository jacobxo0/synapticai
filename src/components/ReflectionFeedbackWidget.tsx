import React, { useState } from 'react';
import { ReflectionFeedback } from '@/types/reflection';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon } from './icons/StarIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ReflectionFeedbackWidgetProps {
  reflectionId: string;
  onFeedbackSubmit: (feedback: Omit<ReflectionFeedback, 'id' | 'createdAt'>) => void;
  initialRating?: number;
  initialComment?: string;
}

export const ReflectionFeedbackWidget: React.FC<ReflectionFeedbackWidgetProps> = ({
  reflectionId,
  onFeedbackSubmit,
  initialRating = 0,
  initialComment = '',
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [focusedStar, setFocusedStar] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onFeedbackSubmit({
        reflectionId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment('');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
    >
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <h2 id="feedback-form-title" className="text-lg font-semibold">
              How was this reflection?
            </h2>

            <div className="space-y-2">
              <label htmlFor="rating" className="block text-sm font-medium">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isSelected = rating >= value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="comment" className="block text-sm font-medium">
                Additional Comments
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                aria-label="Additional comments"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-4"
          >
            <div className="text-green-600 mb-2">✓</div>
            <p className="text-sm text-gray-700">
              Thanks for helping us improve!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 