import { Box, Paper, Typography, LinearProgress, useTheme } from '@mui/material';
import { BatteryPack, BatteryCell } from '@/types/telemetry';
import { batteryThresholds } from '@/config/batteryThresholds';

interface BatteryCardProps {
  batteryPack: BatteryPack | null;
}

export default function BatteryCard({ batteryPack }: BatteryCardProps) {
  const theme = useTheme();

  if (!batteryPack) {
    return (
      <Paper sx={{ p: 2, height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No battery data available
        </Typography>
      </Paper>
    );
  }

  const getCellColorValues = (cell: BatteryCell) => {
    if (cell.temperature >= batteryThresholds.temperature.bad || cell.voltage <= batteryThresholds.voltage.bad || cell.stateOfCharge <= batteryThresholds.stateOfCharge.bad) {
      return {
        color: 'error' as 'error',
        bgColor: theme.palette.error.light,
        textColor: theme.palette.error.contrastText,
        progressBgColor: theme.palette.error.dark
      };
    }
    if (cell.temperature >= batteryThresholds.temperature.warning || cell.voltage <= batteryThresholds.voltage.warning || cell.stateOfCharge <= batteryThresholds.stateOfCharge.warning) {
      return {
        color: 'warning' as 'warning',
        bgColor: theme.palette.warning.light,
        textColor: theme.palette.warning.contrastText,
        progressBgColor: theme.palette.warning.dark
      };
    }
    return {
      color: 'success' as 'success',
      bgColor: theme.palette.success.light,
      textColor: theme.palette.success.contrastText,
      progressBgColor: theme.palette.success.dark
    };
  };

  // Helper functions for determining colors for the overall battery metrics
  const getVoltageColor = (voltage: number) => {
    if (voltage <= batteryThresholds.voltage.bad) {
      return 'error' as 'error';
    }
    if (voltage <= batteryThresholds.voltage.warning) {
      return 'warning' as 'warning';
    }
    return 'success' as 'success';
  };

  const getTemperatureColor = (temperature: number) => {
    if (temperature >= batteryThresholds.temperature.bad) {
      return 'error' as 'error';
    }
    if (temperature >= batteryThresholds.temperature.warning) {
      return 'warning' as 'warning';
    }
    return 'success' as 'success';
  };

  const getSoCColor = (stateOfCharge: number) => {
    if (stateOfCharge <= batteryThresholds.stateOfCharge.bad) {
      return 'error' as 'error';
    }
    if (stateOfCharge <= batteryThresholds.stateOfCharge.warning) {
      return 'warning' as 'warning';
    }
    return 'success' as 'success';
  };

  const getCurrentColor = (current: number) => {
    if (current <= batteryThresholds.current.bad) {
      return 'error' as 'error';
    }
    if (current <= batteryThresholds.current.warning) {
      return 'warning' as 'warning';
    }
    return 'success' as 'success';
  };

  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {batteryPack.id}
          </Typography>
          {batteryPack.isBalancing && (
            <Box sx={{ 
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="caption" fontWeight="medium">
                Balancing
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Voltage
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={batteryPack.totalVoltage || 0} 
                color={getVoltageColor(batteryPack.totalVoltage || 0)}
              />
              <Typography variant="body2" color="text.secondary">
                {(batteryPack.totalVoltage || 0).toFixed(2)}V
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Current
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={batteryPack.current || 0} 
                color={getCurrentColor(batteryPack.current || 0)}
              />
              <Typography variant="body2" color="text.secondary">
                {(batteryPack.current || 0).toFixed(2)}A
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Temperature
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={batteryPack.temperature || 0} 
                color={getTemperatureColor(batteryPack.temperature || 0)}
              />
              <Typography variant="body2" color="text.secondary">
                {(batteryPack.temperature || 0).toFixed(1)}°C
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                State of Charge
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={batteryPack.stateOfCharge || 0} 
                sx={{ height: 10, borderRadius: 5 }}
                color={getSoCColor(batteryPack.stateOfCharge || 0)}
              />
              <Typography variant="body2" align="right">
                {(batteryPack.stateOfCharge || 0).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Individual Cells
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(batteryPack.cells || []).map((cell, index) => (
              <Box key={index} sx={{ 
                flex: {
                  xs: '1 1 calc(50% - 4px)', // 2 cells per row on mobile with smaller gap
                  sm: '1 1 calc(33.333% - 8px)' // 3 cells per row on larger screens
                },
                minWidth: { xs: '45%', sm: '80px' } // Better width control on mobile
              }}>
                <Paper 
                  sx={{ 
                    p: { xs: 1, sm: 1.5 }, // Less padding on mobile
                    bgcolor: getCellColorValues(cell).bgColor,
                    color: getCellColorValues(cell).textColor,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5
                  }}
                >
                  <Typography variant="subtitle2" sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider', 
                    pb: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' } // Smaller text on mobile
                  }}>
                    Cell {index + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption">V:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {(cell.voltage || 0).toFixed(2)}V
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption">T:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {(cell.temperature || 0).toFixed(1)}°C
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption">SoC:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {(cell.stateOfCharge || 0).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(cell.stateOfCharge || 0)} 
                    color={getCellColorValues(cell).color}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      mt: 0.5,
                      bgcolor: getCellColorValues(cell).progressBgColor
                    }}
                  />
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
} 