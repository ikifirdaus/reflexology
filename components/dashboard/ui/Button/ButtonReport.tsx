"use client";

import Link from "next/link";
import { useState, ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  url?: string;
  icon?: ReactNode;
  title: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export default function ButtonReport({
  url,
  icon,
  title,
  onClick,
  className = "",
  disabled = false,
}: ButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setLoading(true);
  };

  if (url) {
    return (
      <Link
        href={url}
        onClick={handleClick}
        className={`rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all hover:transition-all w-full ${className}`}
      >
        {loading ? (
          "Loading..."
        ) : (
          <div className="flex items-center gap-1">
            {icon}
            {title}
          </div>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 transition-all hover:transition-all w-full ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        "Loading..."
      ) : (
        <div className="flex items-center gap-1">
          {icon}
          {title}
        </div>
      )}
    </button>
  );
}
