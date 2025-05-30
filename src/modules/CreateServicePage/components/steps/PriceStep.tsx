import React, { useState } from "react";

import * as Slider from "@radix-ui/react-slider";
import { useFormikContext } from "formik";

import { steps } from "@/modules/CreateServicePage/constants/steps";
import type { Step } from "@/modules/CreateServicePage/types";

export const PriceStep = () => {
  const {
    values: { price },
    setFieldValue,
    errors,
    touched,
  } = useFormikContext<any>();
  const [isEditing, setIsEditing] = useState(false);
  const step: Step = steps.find((s) => s.id === "price")!;

  const increment = () => {
    if (price < 50) setFieldValue("price", price + 1);
  };
  const decrement = () => {
    if (price > 0) setFieldValue("price", price - 1);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setFieldValue("price", val);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900">{step.question}</h2>
      <p className="text-gray-600">{step.description}</p>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={decrement}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100"
          disabled={isEditing}
        >
          −
        </button>

        {isEditing ? (
          <input
            type="number"
            min={0}
            value={price}
            onChange={handlePriceChange}
            onBlur={() => setIsEditing(false)}
            className="w-[100px] text-5xl font-bold text-primary text-center bg-transparent border-none outline-none appearance-none"
            autoFocus
          />
        ) : (
          <span
            className="text-5xl font-bold text-primary cursor-pointer"
            onClick={() => setIsEditing(true)}
            title="Haz clic para editar el precio"
          >
            €{price}
          </span>
        )}

        <button
          type="button"
          onClick={increment}
          className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-xl hover:bg-gray-100"
          disabled={isEditing}
        >
          +
        </button>
      </div>

      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-6"
        value={[price > 50 ? 50 : price]}
        min={0}
        max={50}
        step={1}
        onValueChange={([value]) => setFieldValue("price", value)}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
          <Slider.Range className="absolute bg-primary rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Precio"
        />
      </Slider.Root>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-gray-500 underline hover:text-primary"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Volver al selector" : "Otro precio"}
        </button>
      </div>

      {errors.price && touched.price && (
        <p className="text-red-500">{errors.price as string}</p>
      )}
    </div>
  );
};
