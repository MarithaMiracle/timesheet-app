'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); 

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        rememberMe,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please use test@example.com and password123');
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
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
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
          {error.includes('test@example.com') && (
            <p className="text-red-500 text-xs mt-1">
              
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}