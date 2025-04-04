import React from "react";

interface ISeparatorProps {
  children: React.ReactNode;
}

export const Separator = ({ children }: ISeparatorProps) => {
  return (
    <div className="flex items-center my-8">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="mx-4 text-sm text-gray-600 font-medium">{children}</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};
