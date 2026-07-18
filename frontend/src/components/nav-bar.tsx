'use client';

import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import { UI_STRINGS } from '@/constants/ui-strings';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Code-o-Bit
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button component={Link} href="/" sx={{ my: 2, color: 'white', display: 'block' }}>
              {UI_STRINGS.NAV_HOME}
            </Button>
            <Button component={Link} href="/problems" sx={{ my: 2, color: 'white', display: 'block' }}>
              {UI_STRINGS.NAV_PROBLEMS}
            </Button>
            {user && (
              <Button component={Link} href="/dashboard" sx={{ my: 2, color: 'white', display: 'block' }}>
                {UI_STRINGS.NAV_LEADERBOARD} {/* Repurposed as Dashboard for now */}
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2, alignItems: 'center' }}>
            {user ? (
              <>
                <Typography variant="body2" color="secondary">
                  Hi, {user.username}
                </Typography>
                <Button variant="outlined" color="primary" onClick={logout}>
                  {UI_STRINGS.AUTH_LOGOUT}
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} href="/login" color="inherit">
                  {UI_STRINGS.NAV_LOGIN}
                </Button>
                <Button component={Link} href="/signup" variant="contained" color="primary">
                  {UI_STRINGS.NAV_SIGNUP}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
