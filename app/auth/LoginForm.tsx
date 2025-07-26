// app/auth/LoginForm.tsx
'use client'; // This component will have client-side interactivity

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // For next-auth authentication
import { useRouter } from 'next/navigation'; // For redirection

// We'll create these UI components in components/ui later
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
// We might create a dedicated Checkbox component if needed, or inline for simplicity here

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null); // For displaying login errors
  const [loading, setLoading] = useState(false); // For showing loading state on button

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      // Dummy authentication logic via next-auth's CredentialsProvider
      const result = await signIn('credentials', {
        redirect: false, // Prevent next-auth from redirecting automatically
        email,
        password,
        rememberMe, // Pass 'rememberMe' if your credential provider uses it
      });

      if (result?.error) {
        // Handle specific errors if next-auth credentials provider returns them
        // For our dummy auth, we'll just show a generic error or a custom one
        setError(result.error);
      } else if (result?.ok) {
        // On success, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-1" htmlFor="email">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          // Add error state prop here later for validation
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-black mb-1" htmlFor="password">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          // Add error state prop here later for validation
        />
      </div>
      <div className="flex items-center mb-6">
        <input
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label className="ml-2 block text-sm text-gray-900" htmlFor="remember-me">
          Remember me
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full" // Tailwind class to make it full width
        disabled={loading} // Disable button while loading
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}