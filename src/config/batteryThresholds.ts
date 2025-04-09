export const batteryThresholds = {
  voltage: {
    good: 3.7, // Voltage above this is considered good
    warning: 3.0, // Voltage below this is a warning
    bad: 2.5 // Voltage below this is bad
  },
  temperature: {
    good: 35, // Temperature below this is good
    warning: 45, // Temperature below this is a warning
    bad: 55 // Temperature above this is bad
  },
  stateOfCharge: {
    good: 80, // SoC above this is good
    warning: 80, // SoC below this is a warning
    bad: 20 // SoC below this is bad
  },
  current: {
    good: 90, // Current above this is good
    warning: 50, // Current below this is a warning
    bad: 20 // Current below this is bad
  }
}; 