// app/auth/LoginFormContainer.tsx
import LoginForm from './LoginForm'; // Will create this

export default function LoginFormContainer() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Welcome back</h1>
        <LoginForm />
      </div>
    </div>
  );
}