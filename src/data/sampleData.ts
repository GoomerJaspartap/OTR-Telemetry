import { TelemetryData } from '@/types/telemetry';

export const sampleTelemetryData: TelemetryData = {
  timestamp: Date.now(),
  speed: 45.2,
  gps: {
    latitude: 37.7749,
    longitude: -122.4194,
    speed: 45.2,
    heading: 180,
    altitude: 10
  },
  throttle: {
    sensor1: {
      percentage: 35.5,
      rawValue: 355,
    },
    sensor2: {
      percentage: 36.2,
      rawValue: 362,
    },
    average: 35.8,
    demand: 35.8
  },
  brake: {
    sensor1: {
      percentage: 0,
      rawValue: 0,
    },
    sensor2: {
      percentage: 0,
      rawValue: 0,
    },
    average: 0,
    demand: 0
  },
  imu: {
    acceleration: {
      x: 0.1,
      y: 0.2,
      z: 9.8
    },
    gyroscope: {
      x: 0.01,
      y: 0.02,
      z: 0.03
    },
    orientation: {
      x: 0.5,
      y: 0.3,
      z: 0.1
    }
  },
  batteryPacks: [
    {
      id: '1',
      totalVoltage: 96.5,
      current: 45.2,
      stateOfCharge: 85.5,
      temperature: 32.1,
      isBalancing: false,
      cells: Array(10).fill({
        voltage: 3.85,
        temperature: 32.1,
        stateOfCharge: 85.5,
        isBalancing: false
      })
    },
    {
      id: '2',
      totalVoltage: 97.2,
      current: 42.8,
      stateOfCharge: 87.2,
      temperature: 31.8,
      isBalancing: false,
      cells: Array(10).fill({
        voltage: 3.87,
        temperature: 31.8,
        stateOfCharge: 87.2,
        isBalancing: false
      })
    }
  ],
  errors: {
    batteryOvervoltage: false,
    batteryUndervoltage: false,
    motorOverheating: false,
    controllerError: false,
    throttleSensorMismatch: false,
    brakeSensorMismatch: false,
    imuError: false,
    gpsError: false,
    canBusError: false,
    systemError: false
  }
}; 