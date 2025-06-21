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
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }

    // Si el href comienza con #, hacer scroll suave en lugar de navegación
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div onClick={handleClick}>
      <a
        href={href}
        className={`text-gray-600 hover:text-gray-800 transition-colors ${className}`}
      >
        {children}
      </a>
    </div>
  );
};
