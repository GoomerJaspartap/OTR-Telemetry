import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface SpeedGaugeProps {
  speed: number;
}

export default function SpeedGauge({ speed }: SpeedGaugeProps) {
  const theme = useTheme();
  const progress = (speed / 120) * 100;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress 
          variant="determinate" 
          value={progress} 
          size={200} 
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography 
            variant="h4" 
            component="div" 
            color="textPrimary"
            sx={{ 
              fontWeight: 'bold',
              textShadow: `0 0 10px ${theme.palette.primary.main}33`,
            }}
          >
            {Math.round(speed)}
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="textSecondary"
            sx={{ mt: 1 }}
          >
            km/h
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
} 