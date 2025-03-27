import React from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  border?: boolean;
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  onClick,
}) => {
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
