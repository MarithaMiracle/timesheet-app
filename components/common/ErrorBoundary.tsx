'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    this.props.onError?.(error, errorInfo);

    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Oops! Something went wrong
                </h2>
                
                <p className="text-sm text-gray-600 mb-6">
                  We&apos;re sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
                      Error Details (Development)
                    </summary>
                    <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={this.handleReset}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={this.handleReload}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    Reload Page
                  </Button>
                </div>

                <div className="mt-6">
                  <Link
                    href="/"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    ← Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}