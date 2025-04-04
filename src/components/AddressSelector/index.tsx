import React, { useState } from "react";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { MdLocationOn } from "react-icons/md";

interface AddressSelectorProps {
  value: string;
  onChange: (address: string) => void;
}

const libraries: "places"[] = ["places"];

export const AddressSelector: React.FC<AddressSelectorProps> = ({
  value,
  onChange,
}) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      onChange(address);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
        <MdLocationOn className="w-5 h-5 text-primary mr-2" />
        <span className="text-gray-700">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
      <MdLocationOn className="w-5 h-5 text-primary mr-2" />
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["address"],
          componentRestrictions: { country: "es" },
        }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ingresa tu dirección"
          className="w-full outline-none text-gray-700"
        />
      </Autocomplete>
    </div>
  );
};
