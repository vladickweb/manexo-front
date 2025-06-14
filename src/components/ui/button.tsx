import { ButtonHTMLAttributes } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  filled?: boolean;
  loading?: boolean;
}

export const Button = ({
  className,
  variant = "default",
  size = "md",
  filled = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
    primary: filled
      ? "bg-primary text-white hover:bg-primary/90"
      : "text-primary border border-primary hover:bg-primary/10",
    secondary: filled
      ? "bg-secondary text-white hover:bg-secondary/90"
      : "text-secondary border border-secondary hover:bg-secondary/10",
    danger: filled
      ? "bg-red-600 text-white hover:bg-red-700"
      : "text-red-600 border border-red-600 hover:bg-red-50",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-11 px-8",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  );
};
