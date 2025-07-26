// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../../components/ui/Button';
import React from 'react';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600', 'text-white', 'py-2', 'px-4', 'rounded-md');
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('spreads additional props', () => {
    render(<Button data-testid="custom-button" type="submit">Submit</Button>);
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('shows loading state correctly', () => {
    render(<Button disabled>Signing in...</Button>);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});