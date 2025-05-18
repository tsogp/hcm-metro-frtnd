'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserFeedbackProps {
  className?: string;
}

export function UserFeedback({ className }: UserFeedbackProps) {
  const feedbacks = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Daily Commuter',
      rating: 5,
      comment: 'The metro system has made my daily commute so much easier. Clean, efficient, and always on time!',
      avatar: '/images/feedback/avatar_2.jpg',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Traveler',
      rating: 4,
      comment: 'Great connectivity across the city. The smart card system is very convenient for frequent travelers.',
      avatar: '/images/feedback/avatar_1.jpg',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Student',
      rating: 5,
      comment: 'Affordable and reliable service. The student discount program is really helpful!',
      avatar: '/images/feedback/avatar_3.jpg',
    },
  ];

  return (
    <div className={cn('w-full', className)}>
      <div className="w-full mt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            What Our Passengers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of satisfied commuters who trust our metro system daily
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={feedback.avatar}
                    alt={feedback.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {feedback.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feedback.role}
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      'w-5 h-5',
                      index < feedback.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                "{feedback.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 