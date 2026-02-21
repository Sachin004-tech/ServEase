import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg", // sm | md | lg
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Box */}
      <div
        className={`w-full ${sizeClasses[size]} mx-auto rounded-lg shadow-lg relative bg-gray-800 text-white`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-500 hover:cursor-pointer transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        {title && (
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
