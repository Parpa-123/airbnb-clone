import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapFunc } from "../Components/Main Components/Routed Pages/MapFunc";
import "leaflet/dist/leaflet.css";

interface MapProps {
  city: string;
  country: string;
}

const ListMap = ({ city, country }: MapProps) => {

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      const res = await MapFunc(`${city}, ${country}`);

      if (res && res.lat && res.lng) {
        setCoords({ lat: res.lat, lng: res.lng });
      }
    };

    fetchCoords();
  }, [city, country]);

  if (!coords) return <p>Loading map...</p>;

  return (
    <MapContainer
      center={[coords.lat, coords.lng]}
      zoom={12}
      className="w-full h-80 rounded-xl"
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      <Marker position={[coords.lat, coords.lng]}>
        <Popup>{city}, {country}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default ListMap;
