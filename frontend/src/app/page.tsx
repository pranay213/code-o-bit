'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { UI_STRINGS } from '@/constants/ui-strings';
import NavBar from '@/components/nav-bar';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CodeIcon from '@mui/icons-material/Code';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 0 }, // offset for navbar
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow effects */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50%',
            height: '50%',
            background: 'radial-gradient(circle, rgba(124, 77, 255, 0.15) 0%, rgba(10, 10, 10, 0) 70%)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, rgba(10, 10, 10, 0) 70%)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography variant="h1" gutterBottom sx={{ 
            background: '-webkit-linear-gradient(45deg, #ffffff 30%, #a0a0a0 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}>
            {UI_STRINGS.LANDING_TITLE_MAIN}
          </Typography>
          
          <Typography variant="h1" gutterBottom sx={{ 
            background: '-webkit-linear-gradient(45deg, #7c4dff 30%, #00e5ff 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 4
          }}>
            {UI_STRINGS.LANDING_TITLE_HIGHLIGHT}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '80%', mx: 'auto', lineHeight: 1.6 }}>
            {UI_STRINGS.LANDING_SUBTITLE}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RocketLaunchIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              {UI_STRINGS.LANDING_CTA_PRIMARY}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<CodeIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', border: '1px solid rgba(0, 229, 255, 0.5)' }}
            >
              {UI_STRINGS.LANDING_CTA_SECONDARY}
            </Button>
          </Box>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="body2" color="text.secondary">
          {UI_STRINGS.FOOTER_COPYRIGHT}
        </Typography>
      </Box>
    </Box>
  );
}
