// app/auth/page.tsx
import LoginFormContainer from './LoginFormContainer'; // Will create this
import PromotionalContent from './PromotionalContent'; // Will create this

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-col md:flex-row"> {/* Added flex-col for mobile */}
      {/* Left Column - Login Form Section */}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-8 md:p-16 bg-white">
        <LoginFormContainer />
        <div className="text-center text-gray-500 text-sm mt-8 md:mt-0">
          © 2025 tentwenty
        </div>
      </div>

      {/* Right Column - Promotional Content Section */}
      <div className="hidden md:flex w-full md:w-1/2 bg-blue-600 items-center justify-center p-8 md:p-16 text-white">
        <PromotionalContent />
      </div>
    </div>
  );
}