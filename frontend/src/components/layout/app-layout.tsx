'use client';

import * as React from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, InputBase, Badge, Avatar, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Notifications as NotificationsIcon, LocalFireDepartment as FireIcon } from '@mui/icons-material';
import Sidebar from '@/components/layout/sidebar';
import { useAuth } from '@/context/auth-context';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - 260px)` } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'background.default', 
                borderRadius: 2, 
                px: 2, 
                py: 0.5,
                width: { xs: '100%', md: 400 }
              }}>
                <SearchIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                <InputBase 
                  placeholder="Search problems, contests, users..." 
                  sx={{ ml: 1, flex: 1, fontSize: '0.9rem' }} 
                />
                <Box sx={{ 
                  bgcolor: 'background.paper', 
                  borderRadius: 1, 
                  px: 1, 
                  border: '1px solid',
                  borderColor: 'divider',
                  display: { xs: 'none', sm: 'block' }
                }}>
                  <Typography variant="caption" color="text.secondary">⌘ K</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FireIcon color="error" fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>12</Typography>
              </Box>
              <IconButton color="inherit" size="small">
                <Badge badgeContent={5} color="error">
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  src="https://mui.com/static/images/avatar/1.jpg" 
                  alt={user?.username || 'User'} 
                  sx={{ width: 32, height: 32 }}
                />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                    {user?.username || 'Pranay Kodam'}
                  </Typography>
                  <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                    Rating 1624
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
