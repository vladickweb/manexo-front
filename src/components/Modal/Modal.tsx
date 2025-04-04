import React, { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  containerClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  containerClassName = "w-11/12 max-w-lg",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className={`relative bg-white shadow-lg p-6 z-10 w-full h-full flex flex-col md:h-auto md:rounded-lg md:${containerClassName}`}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex-none w-full">
          {title && (
            <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
          )}
          <div className="w-full">
            {React.Children.map(children, (child) => {
              if (
                React.isValidElement(child) &&
                child.type === "div" &&
                child.props.className?.includes("mb-6 flex border-b")
              ) {
                return child;
              }
              return null;
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          {React.Children.map(children, (child) => {
            if (
              !(
                React.isValidElement(child) &&
                child.type === "div" &&
                child.props.className?.includes("mb-6 flex border-b")
              )
            ) {
              return child;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
