import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents, Polygon, Tooltip, LayerGroup } from 'react-leaflet';
import * as h3 from 'h3-js';
import { Region } from '../types/GeoTypes';
import { ZOOM_TO_H3_RES_CORRESPONDENCE } from '../utils/constants';

const MapUpdater = ({
  currentH3Res,
  setCurrentH3Res,
  activeRegion,
  setRegions,
  regions,
}: {
  currentH3Res: number;
  setCurrentH3Res: React.Dispatch<React.SetStateAction<number>>;
  activeRegion: Region | undefined;
  setRegions: React.Dispatch<React.SetStateAction<Region[]>>;
  regions: Region[];
}) => {
  const map = useMap();
  const [h3s, setH3s] = useState<string[]>([]);

  const updateMapDisplay = () => {
    const zoom = map.getZoom();
    const newH3Res:number = ZOOM_TO_H3_RES_CORRESPONDENCE[zoom] || 8;
    if (newH3Res !== currentH3Res) {
      setCurrentH3Res(newH3Res);
    }

    const bounds = map.getBounds();
    const h3Cells = h3.polygonToCells([
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
      [bounds.getNorthEast().lat, bounds.getSouthWest().lng],
      [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
      [bounds.getSouthWest().lat, bounds.getNorthEast().lng],
      [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
    ], newH3Res);

    setH3s(h3Cells);
  };

  useMapEvents({
    zoomend: updateMapDisplay,
    moveend: updateMapDisplay,
    click: (e) => {
      if (activeRegion) {
        const h3Id = h3.latLngToCell(e.latlng.lat, e.latlng.lng, currentH3Res);
        const isCellInOtherRegion = regions.some(region => region.cellIds.includes(h3Id) && region.id !== activeRegion.id);

        if (!isCellInOtherRegion) {
          setRegions(prev => prev.map(region => (
            region.id === activeRegion.id
              ? { ...region, cellIds: [...region.cellIds, h3Id] }
              : region
          )));
        }
      }
    },
  });

  useEffect(() => {
    updateMapDisplay();
  }, []);

  return (
    <LayerGroup>
      {h3s.map(h3id => {
        const h3Bounds = h3.cellToBoundary(h3id);
        const region = regions.find(r => r.cellIds.includes(h3id));
        return (
          <Polygon
            key={h3id}
            positions={h3Bounds.map(([lat, lng]) => [lat, lng])}
            pathOptions={{ color: region?.color || 'blue' }}
          >
            <Tooltip>{region?.name || 'Unassigned'}</Tooltip>
          </Polygon>
        );
      })}
    </LayerGroup>
  );
};

export default MapUpdater;
