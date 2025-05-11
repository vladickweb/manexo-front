import { useFormikContext } from "formik";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Step } from "@/modules/CreateServicePage/types";

interface InputStepProps {
  step: Step;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const InputStep = ({ step, onKeyPress }: InputStepProps) => {
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext<any>();
  const Component = step.id === "description" ? Textarea : Input;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900">{step.question}</h2>
      <p className="text-gray-600">{step.description}</p>
      <Component
        name={step.id}
        placeholder={step.placeholder}
        value={values[step.id]}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyPress={onKeyPress}
        className="text-lg"
      />
      {errors[step.id] && touched[step.id] && (
        <p className="text-red-500">{errors[step.id] as string}</p>
      )}
    </div>
  );
};

export default InputStep;
