import { HTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

interface SelectTriggerProps extends HTMLAttributes<HTMLDivElement> {}
interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {}
interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}
interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {}

export const Select = ({
  children,
  onValueChange,
  value,
  ...props
}: SelectProps) => {
  return (
    <div className="relative">
      <select
        className="hidden"
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        {...props}
      >
        {children}
      </select>
      {children}
    </div>
  );
};

export const SelectTrigger = ({
  className,
  children,
  ...props
}: SelectTriggerProps) => {
  return (
    <div
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
};

export const SelectContent = ({
  className,
  children,
  ...props
}: SelectContentProps) => {
  return (
    <div
      className={cn(
        "relative mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
        className,
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const SelectItem = ({
  className,
  children,
  ...props
}: SelectItemProps) => {
  return (
    <div
      className={cn(
        "relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const SelectValue = ({
  className,
  children,
  ...props
}: SelectValueProps) => {
  return (
    <span className={cn("block truncate", className)} {...props}>
      {children}
    </span>
  );
};
