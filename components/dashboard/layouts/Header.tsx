"use client";

import { useState } from "react";
import { LogOut, User, Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 text-gray-700 h-16">
      <div className="h-full px-6 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative ml-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
          >
            <User className="w-5 h-5" />
            <span>{session?.user?.name}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
              >
                {isLoggingOut ? (
                  <>
                    <div className="loader w-4 h-4 border-2 border-t-transparent border-gray-700 rounded-full animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
