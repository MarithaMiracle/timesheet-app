import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (email === 'test@example.com' && password === 'password123') {
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
        } else {
throw new Error('Invalid email or password! Please use test@example.com and password123');
        }
      },
    }),
  ],
  
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export async function auth() {
  return getServerSession(authOptions);
}