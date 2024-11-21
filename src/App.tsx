import { useRef, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Region } from './types/GeoTypes';
import { cityCenters } from './utils/constants';
import MapUpdater from './components/MapUpdater';
import RegionManager from './components/RegionManager';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [activeRegion, setActiveRegion] = useState<Region | undefined>();
  const [currentH3Res, setCurrentH3Res] = useState(8);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { city } = (() => {
    const params = new URLSearchParams(window.location.search);
    return { city: params.get('city') };
  })();
  
  const defaultCenter = cityCenters[city?.toLowerCase() || 'bangalore'];

  return (
    <div id="app">
      <MapContainer
        center={defaultCenter}
        zoom={15}
        style={{ height: "80vh", width: "90%", margin: '0 auto' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={12}
          maxNativeZoom={19}
          maxZoom={24}
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
        />
        <MapUpdater
          currentH3Res={currentH3Res}
          setCurrentH3Res={setCurrentH3Res}
          activeRegion={activeRegion}
          setRegions={setRegions}
          regions={regions}
        />
      </MapContainer>
      <RegionManager
        regions={regions}
        setRegions={setRegions}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        fileInputRef={fileInputRef}
      />
    </div>
  );
};

export default App;
