import React from "react";

interface Tab {
  id: string;
  label: string;
}

interface ServicesTabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
}

export const ServicesTabNav = ({
  activeTab,
  onTabChange,
  tabs,
}: ServicesTabNavProps) => {
  return (
    <div className="flex space-x-4 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
