import { useEffect } from "react";

import { useFormikContext } from "formik";

import { Map } from "@/components/Map/Map";
import { SliderMarkup } from "@/modules/CreateServicePage/components/SliderMarkup";
import { RADIO_OPTIONS } from "@/modules/CreateServicePage/constants";

interface AddressComponents {
  streetName: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface LocationStepProps {
  showRadius: boolean;
  setShowRadius: (show: boolean) => void;
  onLocationSelect: (
    lat: number,
    lng: number,
    address: AddressComponents,
  ) => void;
}

const LocationStep = ({
  showRadius,
  setShowRadius,
  onLocationSelect,
}: LocationStepProps) => {
  const { values, errors, touched, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    if (values.location.latitude !== 0 && values.location.longitude !== 0) {
      setShowRadius(true);
    }
  }, [values.location.latitude, values.location.longitude, setShowRadius]);

  const handleRadiusChange = (radius: number) => {
    setFieldValue("radius", radius);
  };

  const handleLocationSelect = (
    lat: number,
    lng: number,
    address: AddressComponents,
  ) => {
    setFieldValue("location", {
      latitude: lat,
      longitude: lng,
      address: `${address.streetName} ${address.streetNumber}, ${address.city}, ${address.province} ${address.postalCode}`,
      addressComponents: address,
    });
    setShowRadius(true);
    onLocationSelect(lat, lng, address);
  };

  // Determinar la ubicación inicial del mapa
  const initialLocation = {
    lat: values.location.latitude,
    lng: values.location.longitude,
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Selecciona la ubicación en el mapa donde prestarás el servicio
      </p>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <Map
          location={initialLocation}
          radius={values.radius || RADIO_OPTIONS[2].value}
          onLocationSelect={handleLocationSelect}
          initialAddress={values.location.addressComponents}
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
