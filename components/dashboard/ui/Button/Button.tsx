"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";

interface ButtonProps {
  url: ReactNode;
  icon: ReactNode;
  title: ReactNode;
  className: string; // Ubah dari String menjadi string
}

export default function Button({ url, icon, title, className }: ButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Link
      href={`${url}`}
      onClick={() => setLoading(true)}
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
