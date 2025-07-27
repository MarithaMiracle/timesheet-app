// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession } from "next-auth";

// Move the authOptions configuration here
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // --- Dummy Authentication Logic (for assessment purposes) ---
        const email = credentials?.email;
        const password = credentials?.password;

        if (email === 'test@example.com' && password === 'password123') {
          // If successful, return a user object.
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
        } else {
          // If authentication fails, return null
          // ✅ CHANGE THIS LINE: Instead of returning null, throw an error
throw new Error('Invalid email or password! Please use test@example.com and password123');
        }
      },
    }),
  ],
  // Optional: Set custom pages for Next-Auth UI
  pages: {
    signIn: '/auth', // Your custom login page route
    error: '/auth', // Redirect to login page on authentication errors
  },
  // Session management: using JWTs for App Router
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days session
  },
  // Callbacks are essential for customizing session and JWT
  callbacks: {
    async jwt({ token, user }) {
      // User object is available on sign in (from authorize function)
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Session object is what's exposed to the client (useSession, getSession)
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  // Secret is required for signing and encrypting session cookies
  secret: process.env.NEXTAUTH_SECRET,
};

export async function auth() {
  return getServerSession(authOptions);
}