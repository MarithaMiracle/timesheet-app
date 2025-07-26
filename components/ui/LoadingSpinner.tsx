// components/ui/LoadingSpinner.tsx
import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  const spinner = (
    <div
      className={cn(
        'animate-spin inline-block border-2 border-current border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      {spinner}
      {text && (
        <p className={cn('text-sm font-medium', colorClasses[color])}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

// Skeleton loading component for content placeholders
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
  avatar?: boolean;
}> = ({ lines = 3, className, avatar = false }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gray-300 rounded',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Page loading component
export const PageLoader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LoadingSpinner 
      size="sm" 
      color="white" 
      className={cn('mr-2', className)} 
    />
  );
};