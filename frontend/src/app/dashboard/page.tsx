'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Grid, Avatar, Chip, Divider, List, 
  ListItem, ListItemText, ListItemIcon, ListItemButton, CircularProgress, Alert
} from '@mui/material';
import AppLayout from '@/components/layout/app-layout';
import CodingPreloader from '@/components/ui/coding-preloader';
import RatingChart from '@/components/charts/rating-chart';
import ActivityHeatmap from '@/components/charts/activity-heatmap';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import { 
  Code as CodeIcon, EmojiEvents as TrophyIcon, LocalFireDepartment as FireIcon,
  CheckCircle as CheckCircleIcon, CalendarMonth as CalendarIcon, LocationOn as LocationIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

interface DashboardStats {
  profile: any;
  stats: {
    solvedCount: number;
    rating: number;
    globalRank: number;
    acceptanceRate: number;
  };
  recentSubmissions: any[];
  heatmapData: any[];
  ratingHistory: any[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/users/me/dashboard', { requireAuth: true });
        if (response.success && response.data) {
          setStatsData(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard data');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (authLoading || !user) {
    return <CodingPreloader />;
  }

  return (
    <AppLayout>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {loading || !statsData ? (
        <CodingPreloader />
      ) : (
      <Grid container spacing={3}>
        
        {/* Left Column (Profile & Rating Chart) */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Profile Card */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Avatar 
                src={statsData.profile.avatarUrl || "https://mui.com/static/images/avatar/1.jpg"} 
                sx={{ width: 80, height: 80, border: '3px solid #3b82f6' }}
              />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{statsData.profile.username}</Typography>
                  <Chip label="Pro" size="small" sx={{ bgcolor: '#8b5cf6', color: 'white', height: 20, fontSize: 10, fontWeight: 'bold' }} />
                </Box>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">{statsData.profile.bio || 'Full Stack Developer'}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <LocationIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">{statsData.profile.country || 'Global'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <CalendarIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                    Member since {new Date(statsData.profile.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Rating Graph Card */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="success.main">{statsData.stats.rating}</Typography>
                <Typography variant="caption" color="text.secondary">Current Rating</Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>#{statsData.stats.globalRank}</Typography>
                <Typography variant="caption" color="text.secondary">Global Rank</Typography>
              </Box>
            </Box>
            <RatingChart data={statsData.ratingHistory} />
          </Paper>

          {/* Recommended For You */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Recommended for You</Typography>
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={() => router.push('/problems')}>View All</Typography>
            </Box>
            <List disablePadding>
              {[
                { name: 'Two Sum', diff: 'Easy', tag: 'Array', solved: '35.2K' },
                { name: 'Longest Substring', diff: 'Medium', tag: 'String', solved: '28.7K' },
              ].map((prob, i) => (
                <ListItem key={i} disablePadding sx={{ py: 1, borderBottom: i !== 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ width: 24, color: 'text.secondary' }}>{i+1}</Typography>
                  <ListItemText 
                    primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>{prob.name}</Typography>} 
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label={prob.diff} size="small" sx={{ height: 20, fontSize: 10, bgcolor: 'success.dark', color: 'white' }} />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Middle Column (Stats, Contests, Heatmap) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          {/* Top Stats Grid */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' }}><CodeIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Solved Problems</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{statsData.stats.solvedCount}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}><TrophyIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Contest Rating</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{statsData.stats.rating}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}><FireIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Global Rank</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{statsData.stats.globalRank}</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}><CheckCircleIcon /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Acceptance</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{statsData.stats.acceptanceRate}%</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Problem Solving Activity */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Problem Solving Activity</Typography>
            </Box>
            <ActivityHeatmap data={statsData.heatmapData} />
          </Paper>
        </Grid>

        {/* Right Column (Submissions, Leaderboard, Continue Learning) */}
        <Grid size={{ xs: 12, lg: 3 }}>
          {/* Recent Submissions */}
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Recent Submissions</Typography>
              <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} onClick={() => router.push('/dashboard/submissions')}>View All</Typography>
            </Box>
            <List disablePadding>
              {statsData.recentSubmissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No recent submissions found.</Typography>
              ) : statsData.recentSubmissions.slice(0, 5).map((s: any, i: number) => (
                <ListItem key={i} disablePadding sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><DescriptionIcon fontSize="small" color="action" /></ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>{s.problemTitle}</Typography>} 
                    secondary={<Typography variant="caption" color="text.secondary">{s.language}</Typography>} 
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color={s.status === 'Accepted' ? 'success.main' : 'error.main'} sx={{ display: 'block' }}>{s.status}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Quick Links */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Quick Links</Typography>
            <List disablePadding>
                <ListItem disablePadding sx={{ borderRadius: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
                  <ListItemButton onClick={() => router.push('/leaderboard')} sx={{ py: 1 }}>
                    <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>Global Leaderboard</Typography>} />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ borderRadius: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
                  <ListItemButton onClick={() => router.push('/discuss')} sx={{ py: 1 }}>
                    <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 'bold' }}>Discussion Forums</Typography>} />
                  </ListItemButton>
                </ListItem>
            </List>
          </Paper>
        </Grid>
        
      </Grid>
      )}
    </AppLayout>
  );
}
