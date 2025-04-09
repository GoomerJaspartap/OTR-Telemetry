import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import type { ViewState } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface CarMapProps {
  gpsData: {
    latitude: number;
    longitude: number;
    speed: number;
  };
}

export default function CarMap({ gpsData }: CarMapProps) {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: gpsData?.latitude || 0,
    longitude: gpsData?.longitude || 0,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  useEffect(() => {
    if (gpsData?.latitude && gpsData?.longitude) {
      setViewport(prev => ({
        ...prev,
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
      }));
    }
  }, [gpsData]);

  return (
    <Box sx={{ width: '100%', height: '300px', position: 'relative' }}>
      <Map
        mapboxAccessToken={process.env.VITE_MAPBOX_TOKEN}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: '100%', height: '100%' }}
      >
        {gpsData?.latitude && gpsData?.longitude && (
          <Marker
            latitude={gpsData.latitude}
            longitude={gpsData.longitude}
            color="red"
          />
        )}
        <NavigationControl />
      </Map>
    </Box>
  );
} 