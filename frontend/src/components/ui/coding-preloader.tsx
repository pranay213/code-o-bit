'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

export default function CodingPreloader() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '400px',
        width: '100%'
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'rgba(59, 130, 246, 0.1)',
          mb: 3,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
            '70%': { boxShadow: '0 0 0 15px rgba(59, 130, 246, 0)' },
            '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
          }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'monospace', 
            fontWeight: 'bold', 
            color: 'primary.main',
            animation: 'blink 1s infinite step-start',
            '@keyframes blink': {
              '50%': { opacity: 0 }
            }
          }}
        >
          {`{ }`}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
        Compiling data{dots}
      </Typography>
    </Box>
  );
}
