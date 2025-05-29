import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#C26728] flex justify-center items-center min-h-screen">
      <Image
        src="/logo6.png"
        width={400}
        height={100}
        alt="logo"
        className="w-80 md:w-auto"
      />
    </div>
  );
}
