// components/ui/Button.tsx
import * as React from 'react';
import { cn } from '../../lib/utils'; // We'll create this utility for conditional classes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // You can add variants here for different button styles (primary, secondary, danger)
  // variant?: 'primary' | 'secondary' | 'danger';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;