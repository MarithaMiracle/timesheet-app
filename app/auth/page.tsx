import LoginFormContainer from './LoginFormContainer';
import PromotionalContent from './PromotionalContent';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row"> 
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-between w-full lg:w-1/2 p-4 sm:p-8 lg:p-16 bg-white order-2 lg:order-1">
        <LoginFormContainer />
        <div className="text-center text-gray-500 text-sm mt-8 lg:mt-0">
          © 2025 tentwenty
        </div>
      </div>

      {/* Right side - Promotional Content */}
      <div className="w-full lg:w-1/2 bg-blue-600 items-center justify-center p-4 sm:p-8 lg:p-16 text-white order-1 lg:order-2 flex min-h-[200px] lg:min-h-screen">
        <PromotionalContent />
      </div>
    </div>
  );
}