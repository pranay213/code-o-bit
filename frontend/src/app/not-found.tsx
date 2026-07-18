'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Construction as ConstructionIcon, Code as CodeIcon } from '@mui/icons-material';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            mb: 6,
            animation: 'swing 3s infinite ease-in-out',
            transformOrigin: 'top center',
            '@keyframes swing': {
              '0%': { transform: 'rotate(5deg)' },
              '50%': { transform: 'rotate(-5deg)' },
              '100%': { transform: 'rotate(5deg)' }
            }
          }}
        >
          {/* Crane Line */}
          <Box 
            sx={{ 
              width: 2, 
              height: 100, 
              bgcolor: 'text.secondary', 
              margin: '0 auto',
              position: 'absolute',
              top: -100,
              left: '50%',
              transform: 'translateX(-50%)'
            }} 
          />
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 3,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
              border: '4px dashed rgba(0,0,0,0.2)'
            }}
          >
            <ConstructionIcon sx={{ fontSize: 60 }} />
          </Box>
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: -20, 
              right: -20, 
              bgcolor: 'background.paper',
              borderRadius: '50%',
              p: 1,
              boxShadow: 3
            }}
          >
            <CodeIcon color="primary" />
          </Box>
        </Box>

        <Typography variant="h1" sx={{ fontWeight: 900, fontSize: { xs: '4rem', md: '6rem' }, color: 'text.primary', mb: 1 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          This page could not be found.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 500, mx: 'auto' }}>
          We're currently building and constructing this section of the platform. Please check back later or return to the dashboard.
        </Typography>
        
        {/* Construction Tape */}
        <Box 
          sx={{ 
            width: '100%', 
            height: 20, 
            background: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #1e293b 20px, #1e293b 40px)',
            mb: 4,
            borderRadius: 1
          }} 
        />

        <Button 
          variant="contained" 
          size="large"
          onClick={() => router.push('/dashboard')}
          sx={{ borderRadius: 2, px: 4, py: 1.5 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
