import React from "react";

interface ITitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: ITitleProps) => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl xl:text-3xl font-extrabold mb-8 text-gray-800">
        {children}
      </h1>
    </div>
  );
};
