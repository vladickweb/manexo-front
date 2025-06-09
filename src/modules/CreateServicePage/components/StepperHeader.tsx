import { steps } from "@/modules/CreateServicePage/constants/steps";

interface StepperHeaderProps {
  currentStep: number;
}

export const StepperHeader = ({ currentStep }: StepperHeaderProps) => (
  <div className="w-full">
    <div className="max-w-4xl mx-auto px-4">
      <div className="py-4">
        <div className="flex items-center justify-between px-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 relative">
              {index !== steps.length - 1 && (
                <div className="absolute top-5 left-[50%] w-full h-1 bg-gray-200">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: index < currentStep ? "100%" : "0%" }}
                  />
                </div>
              )}
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStep
                      ? "bg-primary text-white"
                      : index === currentStep
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                    index <= currentStep ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
