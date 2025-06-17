import React from "react";

import * as Slider from "@radix-ui/react-slider";

interface PriceSliderProps {
  min: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const DISPLAY_MAX = 50;
const BACKEND_MAX = 1000;

export const PriceSlider: React.FC<PriceSliderProps> = ({
  min,
  value,
  onChange,
}) => {
  const displayValue = (val: number) => (val >= DISPLAY_MAX ? "+50" : val);

  const handleChange = ([minVal, maxVal]: [number, number]) => {
    const realMin = minVal;
    const realMax = maxVal >= DISPLAY_MAX ? BACKEND_MAX : maxVal;
    onChange([realMin, realMax]);
  };

  const sliderValue: [number, number] = [
    value[0],
    value[1] >= BACKEND_MAX ? DISPLAY_MAX : value[1],
  ];

  return (
    <div className="w-full px-2 py-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Rango de precio (€)
      </label>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 min-w-[32px]">
          {displayValue(sliderValue[0])}
        </span>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={sliderValue}
          min={min}
          max={DISPLAY_MAX}
          step={1}
          onValueChange={handleChange}
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-primary rounded-full h-full transition-all duration-200" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110 transition-transform"
            aria-label="Precio mínimo"
          />
          <Slider.Thumb
            className="block w-5 h-5 bg-white shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110 transition-transform"
            aria-label="Precio máximo"
          />
        </Slider.Root>
        <span className="text-sm text-gray-500 min-w-[32px]">
          {displayValue(sliderValue[1])}
        </span>
      </div>
    </div>
  );
};
