import { useEffect, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress,
  useTheme
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { onSnapshot, doc } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { TelemetryData } from '@/types/telemetry';
import BatteryCard from '@/components/BatteryCard';
import CarOrientation from '@/components/CarOrientation';
import SpeedGauge from '@/components/SpeedGauge';
import { onAuthStateChanged } from 'firebase/auth';
import { sampleTelemetryData } from '@/data/sampleData';

// Fix for Leaflet marker icons
const icon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = icon;

// This component will update the map view when coordinates change
function MapUpdater({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.setView(position, map.getZoom());
    }
  }, [map, position]);
  
  return null;
}

export default function Dashboard() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      // Use sample data when not authenticated
      setTelemetryData(sampleTelemetryData);
      setLastUpdate(new Date(sampleTelemetryData.timestamp));
      return;
    }

    const telemetryRef = doc(db, 'telemetry', 'ROFuK9WihPvI3St1EFb5'); // Adjust path if needed

    const unsubscribe = onSnapshot(telemetryRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as TelemetryData;
        console.log('Raw Timestamp from Firestore:', data.timestamp);
        const timestampInMilliseconds = data.timestamp * 1000;
        console.log('Timestamp in Milliseconds:', timestampInMilliseconds);
        setTelemetryData(data);
        setLastUpdate(new Date(timestampInMilliseconds)); // Use milliseconds
      } else {
        console.log('No such document!');
        setTelemetryData(sampleTelemetryData); // Use sample data if document doesn't exist
        setLastUpdate(new Date(sampleTelemetryData.timestamp)); // Sample data timestamp might be in ms already
      }
    }, (error) => {
      console.error('Error fetching telemetry data:', error);
      setTelemetryData(sampleTelemetryData); // Fallback to sample data on error
      setLastUpdate(new Date(sampleTelemetryData.timestamp)); // Sample data timestamp might be in ms already
    });

    return () => unsubscribe();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          Please sign in to view telemetry data
        </Typography>
      </Box>
    );
  }

  if (!telemetryData) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      minHeight: '100vh',
      bgcolor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          OTR Telemetry
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last Update: {lastUpdate ? lastUpdate.toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            dateStyle: 'medium', 
            timeStyle: 'medium' 
          }) : 'Never'}
        </Typography>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* System Status Section - Top */}
        <Box>
          <Paper sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[4],
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom color="primary">
              System Status
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' },
              gap: 2
            }}>
              {[
                { name: 'Battery Overvoltage', key: 'batteryOvervoltage' },
                { name: 'Battery Undervoltage', key: 'batteryUndervoltage' },
                { name: 'Motor Overheating', key: 'motorOverheating' },
                { name: 'Controller Error', key: 'controllerError' },
                { name: 'Throttle Sensor Mismatch', key: 'throttleSensorMismatch' },
                { name: 'Brake Sensor Mismatch', key: 'brakeSensorMismatch' },
                { name: 'IMU Error', key: 'imuError' },
                { name: 'GPS Error', key: 'gpsError' },
                { name: 'CAN Bus Error', key: 'canBusError' },
                { name: 'System Error', key: 'systemError' }
              ].map((error) => (
                <Box key={error.key}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: (telemetryData?.errors?.[error.key as keyof typeof telemetryData.errors] ?? false) ? 'error.light' : 'success.light',
                    color: (telemetryData?.errors?.[error.key as keyof typeof telemetryData.errors] ?? false) ? 'error.contrastText' : 'success.contrastText'
                  }}>
                    <Box sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: (telemetryData?.errors?.[error.key as keyof typeof telemetryData.errors] ?? false) ? 'error.main' : 'success.main',
                      mr: 1
                    }} />
                    <Typography variant="body2">
                      {error.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Controls and Speed Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}>
          {/* Vehicle Controls Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[4],
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                Vehicle Controls
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Throttle
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="body2">Sensor 1: {telemetryData?.throttle?.sensor1?.percentage?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.throttle?.sensor1?.percentage ?? 0} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Sensor 2: {telemetryData?.throttle?.sensor2?.percentage?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.throttle?.sensor2?.percentage ?? 0} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Average: {telemetryData?.throttle?.average?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.throttle?.average ?? 0} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Demand: {telemetryData?.throttle?.demand?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.throttle?.demand ?? 0} 
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Brake
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="body2">Sensor 1: {telemetryData?.brake?.sensor1?.percentage?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.brake?.sensor1?.percentage ?? 0} 
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Sensor 2: {telemetryData?.brake?.sensor2?.percentage?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.brake?.sensor2?.percentage ?? 0} 
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2">Average: {telemetryData?.brake?.average?.toFixed(1)}%</Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={telemetryData?.brake?.average ?? 0} 
                        color="error"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Speed Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[4],
              borderRadius: 2
            }}>
              <SpeedGauge speed={telemetryData?.speed || 0} />
            </Paper>
          </Box>
        </Box>

        {/* Battery Packs Section */}
        <Box>
          <Paper sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[4],
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom color="primary">
              Battery System
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3
            }}>
              {telemetryData?.batteryPacks.map((pack) => (
                <Box key={pack.id}>
                  <BatteryCard batteryPack={pack} />
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Map and 3D Model Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}>
          {/* GPS Map Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[4],
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                GPS Location
              </Typography>
              <Box sx={{ height: 300, borderRadius: 1, overflow: 'hidden' }}>
                <MapContainer
                  center={[telemetryData?.gps?.latitude || 0, telemetryData?.gps?.longitude || 0]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[telemetryData?.gps?.latitude || 0, telemetryData?.gps?.longitude || 0]}>
                    <Popup>
                      Speed: {telemetryData?.gps?.speed?.toFixed(1)} km/h
                    </Popup>
                  </Marker>
                  <MapUpdater position={[telemetryData?.gps?.latitude || 0, telemetryData?.gps?.longitude || 0]} />
                </MapContainer>
              </Box>
            </Paper>
          </Box>

          {/* 3D Model Section */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ 
              p: 3,
              height: '100%',
              bgcolor: 'background.paper',
              boxShadow: theme.shadows[4],
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom color="primary">
                Car Orientation
              </Typography>
              <Box sx={{ height: 300 }}>
                <CarOrientation 
                  imuData={{
                    acceleration: telemetryData?.imu?.acceleration || { x: 0, y: 0, z: 0 },
                    gyroscope: telemetryData?.imu?.gyroscope || { x: 0, y: 0, z: 0 },
                    orientation: {
                      // Cast the orientation object to any to bypass TypeScript checks
                      pitch: (telemetryData?.imu?.orientation as any)?.pitch || 0,
                      roll: (telemetryData?.imu?.orientation as any)?.roll || 0,
                      yaw: (telemetryData?.imu?.orientation as any)?.yaw || 0
                    }
                  }} 
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 