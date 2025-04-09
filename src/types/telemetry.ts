export interface SensorData {
  percentage: number;
  rawValue: number;
}

export interface BatteryCell {
  voltage: number;
  temperature: number;
  stateOfCharge: number;
}

export interface BatteryPack {
  id: string;
  totalVoltage: number;
  current: number;
  stateOfCharge: number;
  temperature: number;
  isBalancing: boolean;
  cells: BatteryCell[];
}

export interface IMUData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  gyroscope: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}

export interface GPSData {
  latitude: number;
  longitude: number;
  speed: number;
  altitude: number;
}

export interface TelemetryData {
  timestamp: number;
  speed: number;
  gps: {
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    altitude: number;
  };
  throttle: {
    sensor1: SensorData;
    sensor2: SensorData;
    average: number;
    demand: number;
  };
  brake: {
    sensor1: SensorData;
    sensor2: SensorData;
    average: number;
    demand: number;
  };
  imu: {
    acceleration: {
      x: number;
      y: number;
      z: number;
    };
    gyroscope: {
      x: number;
      y: number;
      z: number;
    };
    orientation: {
      x: number;
      y: number;
      z: number;
    };
  };
  batteryPacks: BatteryPack[];
  errors: {
    batteryOvervoltage: boolean;
    batteryUndervoltage: boolean;
    motorOverheating: boolean;
    controllerError: boolean;
    throttleSensorMismatch: boolean;
    brakeSensorMismatch: boolean;
    imuError: boolean;
    gpsError: boolean;
    canBusError: boolean;
    systemError: boolean;
  };
}

export interface WikiEntry {
  id: string;
  title: string;
  content: string;
  department: 'Electrical' | 'Mechanical' | 'Software' | 'General';
  lastUpdated: number;
  author: string;
  attachments?: string[];
} 