import React from "react";

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  onClick?: () => void;
}

export const ActionButton = ({
  href,
  children,
  className = "",
  onClick,
}: ActionButtonProps) => {
  return (
    <div onClick={onClick}>
      <a
        href={href}
        className={`text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      >
        {children}
      </a>
    </div>
  );
};
