import React, { useState, useRef } from 'react';
import { Region } from '../types/GeoTypes';
import { colors } from '../utils/constants';

const RegionManager = ({
  regions,
  setRegions,
  activeRegion,
  setActiveRegion,
  fileInputRef,
}: {
  regions: Region[];
  setRegions: React.Dispatch<React.SetStateAction<Region[]>>;
  activeRegion: Region | undefined;
  setActiveRegion: React.Dispatch<React.SetStateAction<Region | undefined>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) => {
  const [regionName, setRegionName] = useState('');
  const [color, setColor] = useState(colors[0]);

  const createRegion = () => {
    const newRegion: Region = {
      id: `${Date.now()}`,
      name: regionName,
      color,
      cellIds: [],
    };
    setRegions([...regions, newRegion]);
    setRegionName('');
    setActiveRegion(newRegion);
  };

  const deleteRegion = (regionId: string) => {
    setRegions(regions.filter((region) => region.id !== regionId));
    if (activeRegion?.id === regionId) setActiveRegion(undefined);
  };

  const downloadRegions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(regions, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `regions-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const uploadRegions = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json) && json.every(validateRegion)) {
            setRegions(json);
          } else {
            alert('Invalid JSON format');
          }
        } catch (err) {
          alert('Failed to read the file. Make sure it is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  const validateRegion = (region: any): region is Region => {
    return (
      typeof region.id === 'string' &&
      typeof region.name === 'string' &&
      typeof region.color === 'string' &&
      Array.isArray(region.cellIds) &&
      region.cellIds.every((id: any) => typeof id === 'string')
    );
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <input
            type="text"
            placeholder="Region Name"
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            {colors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button onClick={createRegion} style={{ marginLeft: '10px' }} disabled={!regionName || !color}>
            Create Region
          </button>
        </div>
        <div>
          <button style={{ marginRight: '10px' }} onClick={downloadRegions}>
            Download Regions
          </button>
          <button onClick={() => fileInputRef.current?.click()}>Upload Regions</button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={uploadRegions}
          />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        {regions.map((region) => (
          <div key={region.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="radio"
              name="activeRegion"
              checked={activeRegion?.id === region.id}
              onChange={() => setActiveRegion(region)}
            />
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: region.color,
                marginRight: '10px',
              }}
            ></div>
            <span style={{ minWidth: '100px', marginRight: '30px' }}>{region.name}</span>
            <button onClick={() => deleteRegion(region.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionManager;
