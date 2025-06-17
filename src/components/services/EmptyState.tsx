import React, { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  message: string;
}

export const EmptyState: React.FC<Props> = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100dvh-400px)] w-full">
    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600 text-center max-w-md">{message}</p>
  </div>
);
