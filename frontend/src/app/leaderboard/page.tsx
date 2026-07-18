'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { 
  Box, Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, CircularProgress, 
  Alert, Pagination, Grid, Chip
} from '@mui/material';
import AppLayout from '@/components/layout/app-layout';
import CodingPreloader from '@/components/ui/coding-preloader';
import { apiFetch } from '@/utils/api';
import { useQueryParams } from '@/hooks/use-query-params';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

interface LeaderboardUser {
  _id: string;
  username: string;
  avatarUrl: string;
  country: string;
  solvedCount: number;
  rating: number;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function LeaderboardContent() {
  const { setParam, searchParams, getQueryString } = useQueryParams();
  
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const queryStr = getQueryString();
        const response = await apiFetch(`/users/leaderboard${queryStr ? `?${queryStr}` : ''}`);
        if (response.success && response.data) {
          setUsers(response.data);
          setMeta(response.meta);
        } else {
          setError('Failed to fetch leaderboard');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching leaderboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [getQueryString, searchParams]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: 'rgba(234, 179, 8, 0.2)', color: '#eab308', width: 56, height: 56 }}>
          <TrophyIcon fontSize="large" />
        </Avatar>
        <Typography variant="h3" sx={{ fontWeight: 700 }}>Global Leaderboard</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <CodingPreloader />
      ) : (
        <>
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Rank</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Problems Solved</strong></TableCell>
                  <TableCell align="right"><strong>Rating</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => {
                  const rank = meta ? (meta.page - 1) * meta.limit + index + 1 : index + 1;
                  return (
                    <TableRow key={user._id} hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: rank <= 3 ? 'warning.main' : 'text.primary' }}>
                          #{rank}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.solvedCount} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {user.rating}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          {meta && meta.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={meta.totalPages} 
                page={meta.page} 
                onChange={(e, val) => setParam('page', val.toString())}
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default function LeaderboardPage() {
  return (
    <AppLayout>
      <Suspense fallback={<CircularProgress />}>
        <LeaderboardContent />
      </Suspense>
    </AppLayout>
  );
}
