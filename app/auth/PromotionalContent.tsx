// app/auth/PromotionalContent.tsx
export default function PromotionalContent() {
    return (
      <div className="max-w-md text-center md:text-left"> {/* Added text-center for mobile consistency if shown */}
        <h2 className="text-4xl md:text-5xl font-bold mb-4">ticktock</h2>
        <p className="text-base md:text-lg leading-relaxed">
          Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
        </p>
      </div>
    );
  }