'use client';

import * as React from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Divider, IconButton, useTheme, useMediaQuery 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Code as CodeIcon, 
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  MenuBook as StudyIcon,
  School as CourseIcon,
  Business as BusinessIcon,
  Forum as DiscussIcon,
  Article as ArticleIcon,
  Leaderboard as LeaderboardIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';

const DRAWER_WIDTH = 260;

const MENU_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { type: 'divider', text: 'PRACTICE' },
  { text: 'Problems', icon: <CodeIcon />, path: '/problems' },
  { text: 'Contests', icon: <TrophyIcon />, path: '/contests' },
  { text: 'Virtual Contest', icon: <TimelineIcon />, path: '/virtual-contest' },
  { text: 'Study Plan', icon: <StudyIcon />, path: '/study-plan' },
  { text: 'Courses', icon: <CourseIcon />, path: '/courses' },
  { text: 'Company Sets', icon: <BusinessIcon />, path: '/company' },
  { type: 'divider', text: 'DISCUSS' },
  { text: 'Discuss', icon: <DiscussIcon />, path: '/discuss' },
  { text: 'Editorials', icon: <ArticleIcon />, path: '/editorials' },
  { type: 'divider', text: 'MORE' },
  { text: 'Leaderboard', icon: <LeaderboardIcon />, path: '/leaderboard' },
];

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function Sidebar({ mobileOpen, handleDrawerToggle }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const pathname = usePathname();
  const router = useRouter();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
        <CodeIcon color="primary" fontSize="large" />
        <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
          Code-o-Bit
        </Typography>
      </Box>
      <Divider />
      
      <List sx={{ px: 2, flexGrow: 1, overflowY: 'auto' }}>
        {MENU_ITEMS.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <Typography 
                key={`div-${index}`} 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 2, 
                  mb: 1, 
                  ml: 2, 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  letterSpacing: 1
                }}
              >
                {item.text}
              </Typography>
            );
          }

          const isActive = pathname.startsWith(item.path || '');

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  if (item.path) router.push(item.path);
                  if (isMobile) handleDrawerToggle();
                }}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.dark',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={<Typography sx={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}>{item.text}</Typography>} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          textAlign: 'center'
        }}>
          <TrophyIcon color="warning" sx={{ mb: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Go Premium</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Unlock premium features and boost your coding journey
          </Typography>
          <Box component="button" sx={{ 
            width: '100%', 
            py: 1, 
            borderRadius: 1, 
            bgcolor: 'primary.main', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            fontWeight: 'bold',
            '&:hover': { bgcolor: 'primary.dark' }
          }}>
            Upgrade Now
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
