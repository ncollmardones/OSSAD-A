import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface Props {
  mapUrl: string;
}

const MapInitializer = () => {
  const map = useMap();

  useEffect(() => {
    map.setView([-26.91, -69.08], 10);
  }, [map]);

  return null;
};

const EarthEngineMap: React.FC<Props> = ({ mapUrl }) => {
  return (
    <MapContainer style={{ height: "100%", width: "100%" }}>
      <MapInitializer />
      <TileLayer url={mapUrl} />
    </MapContainer>
  );
};

export default EarthEngineMap;

