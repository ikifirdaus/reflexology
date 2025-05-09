"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react"; // pastikan lucide-react sudah diinstall

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export function ButtonSubmit({
  children,
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`px-4 py-2 flex items-center justify-center gap-2 rounded-lg text-white font-medium transition-colors 
        ${
          isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        } 
        focus:outline-none focus:ring-2 focus:ring-blue-400`}
    >
      {isLoading && <Loader2 className="animate-spin w-4 h-4 text-white" />}
      {children}
    </button>
  );
}
