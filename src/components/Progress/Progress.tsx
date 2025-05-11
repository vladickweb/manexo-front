import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
}

interface ProgressProps {
  steps: Step[];
  currentStep: number;
}

export const Progress = ({ steps, currentStep }: ProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative"
            style={{ width: `${100 / steps.length}%` }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium ${
                index <= currentStep ? "text-primary" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 ${
                  index < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
                style={{ transform: "translateX(50%)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
