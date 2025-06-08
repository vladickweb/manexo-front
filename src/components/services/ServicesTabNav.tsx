import React from "react";

type Props = {
  activeTab: "offered" | "contracted";
  onTabChange: (tab: "offered" | "contracted") => void;
};

export const ServicesTabNav: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      <button
        onClick={() => onTabChange("offered")}
        className={`${
          activeTab === "offered"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
      >
        Servicios Ofrecidos
      </button>
      <button
        onClick={() => onTabChange("contracted")}
        className={`${
          activeTab === "contracted"
            ? "border-primary text-primary"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
      >
        Contratos
      </button>
    </nav>
  </div>
);
