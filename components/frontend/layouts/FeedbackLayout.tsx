import HeaderFeedback from "./HeaderFeedback";
import FooterFeedback from "./FooterFeedback";
import Image from "next/image";

const FeedbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-800">
      {/* Background Image */}
      <Image
        src="/bg-texture.jpg"
        width={2000}
        height={1333}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Overlay + Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderFeedback />
        <main className="flex items-center justify-center flex-1 px-4 py-8">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-xl">
            {children}
          </div>
        </main>
        <FooterFeedback />
      </div>
    </div>
  );
};

export default FeedbackLayout;
