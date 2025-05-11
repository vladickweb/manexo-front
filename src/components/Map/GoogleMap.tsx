import { useRef } from "react";

import {
  Circle,
  GoogleMap as GoogleMapComponent,
  Marker,
} from "@react-google-maps/api";

import { Location } from "@/types/location";

interface GoogleMapProps {
  center: Location;
  position: Location | null;
  radius?: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export const GoogleMapView = ({
  center,
  position,
  radius,
  onClick,
}: GoogleMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <GoogleMapComponent
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={position || center}
      onClick={onClick}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {position && (
        <>
          <Marker
            position={position}
            icon={{
              url: "/map-marker.svg",
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40),
            }}
          />
          {radius && (
            <Circle
              center={position}
              radius={radius}
              options={{
                fillColor: "#3b82f6",
                fillOpacity: 0.2,
                strokeColor: "#3b82f6",
                strokeWeight: 2,
              }}
            />
          )}
        </>
      )}
    </GoogleMapComponent>
  );
};
