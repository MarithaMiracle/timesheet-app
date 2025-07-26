// app/api/auth/[...nextauth]/route.ts (DEFINITIVE FIX FOR EXPORT)
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Diagnostic: Check if NEXTAUTH_SECRET is loaded on the server (you can remove this line after fixing)
console.log('NEXTAUTH_SECRET from route.ts:', process.env.NEXTAUTH_SECRET ? 'Loaded' : 'NOT LOADED');

// Define your authentication options
const authOptions = {
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
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (email === 'test@example.com' && password === 'password123') {
          // If successful, return a user object.
          return {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          };
        } else {
          // If authentication fails, return null or throw an error.
          throw new Error('Invalid email or password');
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
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  // Secret is required for signing and encrypting session cookies
  secret: process.env.NEXTAUTH_SECRET,
};

// Export handlers for GET and POST requests
const handler = NextAuth(authOptions);

// THIS IS THE CRITICAL LINE: Ensure authOptions is included here!
export { handler as GET, handler as POST, authOptions };