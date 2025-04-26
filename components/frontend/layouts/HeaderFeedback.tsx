import Image from "next/image";

const HeaderFeedback = () => {
  return (
    <header className="w-full py-4 px-6 bg-[#C26728] text-center text-lg font-semibold text-white flex justify-center">
      <Image src="/logo6.png" alt="logo" width={130} height={40} />
    </header>
  );
};

export default HeaderFeedback;
