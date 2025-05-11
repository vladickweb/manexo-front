import { useFormikContext } from "formik";

import { Map } from "@/components/Map/Map";
import { SliderMarkup } from "@/modules/CreateServicePage/components/SliderMarkup";
import { RADIO_OPTIONS } from "@/modules/CreateServicePage/constants";

interface LocationStepProps {
  showRadius: boolean;
  onLocationSelect: (lat: number, lng: number, addr: string) => void;
}

const LocationStep = ({ showRadius, onLocationSelect }: LocationStepProps) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  const handleRadiusChange = (radius: number) => {
    setFieldValue("radius", radius);
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Selecciona la ubicación en el mapa donde prestarás el servicio
      </p>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <Map
          initialLocation={{
            lat: values.location.latitude,
            lng: values.location.longitude,
          }}
          center={{
            lat: values.location.latitude,
            lng: values.location.longitude,
          }}
          radius={values.radius || RADIO_OPTIONS[2].value}
          isInteractive={false}
          onLocationSelect={onLocationSelect}
        />
      </div>

      {showRadius && (
        <SliderMarkup
          selectedRadius={values.radius || RADIO_OPTIONS[2].value}
          setSelectedRadius={handleRadiusChange}
        />
      )}

      {(errors as any).location?.address &&
        (touched as any).location?.address && (
          <p className="text-red-500">
            {(errors as any).location.address as string}
          </p>
        )}
    </div>
  );
};

export default LocationStep;
