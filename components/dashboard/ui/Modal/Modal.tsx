// components/dashboard/ui/Modal/Modal.tsx
import React from "react";

const Modal = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
