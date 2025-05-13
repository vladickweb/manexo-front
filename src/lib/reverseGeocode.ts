import axios from "axios";

interface ReverseGeocodeResult {
  barrio?: string;
  municipio?: string;
  display: string;
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<ReverseGeocodeResult> {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Falta la clave VITE_GOOGLE_MAPS_API_KEY en el entorno");
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;
  const params = {
    latlng: `${lat},${lon}`,
    key: apiKey,
    language: "es",
  };

  const { data } = await axios.get(url, { params });

  if (data.status !== "OK" || !data.results.length) {
    throw new Error(
      `Google Geocoding API error: ${data.status} – ${data.error_message || ""}`,
    );
  }

  const topResult = data.results[0];
  const components: Array<{ long_name: string; types: string[] }> =
    topResult.address_components;

  const barrioComp = components.find((c) =>
    c.types.some((t) => t === "neighborhood" || t === "sublocality"),
  );
  const municipioComp = components.find((c) =>
    c.types.some(
      (t) => t === "locality" || t === "administrative_area_level_2",
    ),
  );

  const barrio = barrioComp?.long_name;
  const municipio = municipioComp?.long_name;
  const display =
    [barrio, municipio].filter(Boolean).join(", ") ||
    topResult.formatted_address;

  return { barrio, municipio, display };
}
