import * as Slider from "@radix-ui/react-slider";

import { RADIO_OPTIONS } from "@/modules/CreateServicePage/constants";

interface SliderMarkupProps {
  selectedRadius: number;
  setSelectedRadius: (radius: number) => void;
}

export const SliderMarkup = ({
  selectedRadius,
  setSelectedRadius,
}: SliderMarkupProps) => {
  const currentIndex = RADIO_OPTIONS.findIndex(
    (option) => option.value === selectedRadius,
  );

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Radio de servicio
      </label>
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[currentIndex]}
              min={0}
              max={RADIO_OPTIONS.length - 1}
              step={1}
              onValueChange={([index]) => {
                setSelectedRadius(RADIO_OPTIONS[index].value);
              }}
            >
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                <Slider.Range className="absolute bg-primary rounded-full h-full transition-all duration-200" />
              </Slider.Track>
              {RADIO_OPTIONS.map((_, index) => (
                <div
                  key={index}
                  className={`absolute w-1 h-3 rounded-full transition-colors duration-200 ${
                    index <= currentIndex ? "bg-primary" : "bg-gray-400"
                  }`}
                  style={{
                    left: `${(index / (RADIO_OPTIONS.length - 1)) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              ))}
              <Slider.Thumb
                className="block w-5 h-5 bg-white shadow-lg rounded-full focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110 transition-transform"
                aria-label="Radio de servicio"
              />
            </Slider.Root>
            <div className="absolute -bottom-6 left-0 w-full h-4">
              {RADIO_OPTIONS.map((option, index) => (
                <span
                  key={option.value}
                  className={`absolute text-xs transition-colors duration-200 ${
                    index <= currentIndex
                      ? "text-primary font-medium"
                      : "text-gray-500"
                  }`}
                  style={{
                    left: `${(index / (RADIO_OPTIONS.length - 1)) * 100}%`,
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {option.label}
                </span>
              ))}
            </div>
          </div>
          <span className="text-sm font-medium text-primary min-w-[60px]">
            {RADIO_OPTIONS.find((opt) => opt.value === selectedRadius)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};
