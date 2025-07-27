import LoginForm from './LoginForm';

export default function LoginFormContainer() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-sm mx-auto px-4 sm:px-0">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 text-center lg:text-left">Welcome back</h1>
        <LoginForm />
      </div>
    </div>
  );
}