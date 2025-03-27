import React from "react";

import { Loader } from "@/components/Loader/Loader";

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "default";
  filled?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

const getButtonClasses = (
  variant: "primary" | "secondary" | "default",
  filled: boolean,
  disabled: boolean,
): string => {
  let classes = "px-4 py-2 rounded transition-colors focus:outline-none ";
  const hover = disabled ? "" : " hover:shadow-md";

  switch (variant) {
    case "primary":
      classes += filled
        ? `bg-primary text-white ${disabled ? "" : "hover:bg-primary/90"}`
        : `border border-primary text-primary ${disabled ? "" : "hover:bg-primary hover:text-white"}`;
      break;
    case "secondary":
      classes += filled
        ? `bg-secondary text-white ${disabled ? "" : "hover:bg-secondary/90"}`
        : `border border-secondary text-secondary ${disabled ? "" : "hover:bg-secondary hover:text-white"}`;
      break;
    case "default":
    default:
      classes += filled
        ? `bg-gray-800 text-white ${disabled ? "" : "hover:bg-gray-900"}`
        : `border border-gray-800 text-gray-800 ${disabled ? "" : "hover:bg-gray-800 hover:text-white"}`;
      break;
  }

  return classes + hover;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick,
  type = "button",
  variant = "default",
  filled = false,
  disabled = false,
  loading = false,
}) => {
  const buttonClasses = getButtonClasses(variant, filled, disabled);

  return (
    <button
      className={`${buttonClasses} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {loading ? <Loader /> : children}
    </button>
  );
};
