import * as React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2",
          "text-gray-900",
          "placeholder-gray-500",
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export default Input;