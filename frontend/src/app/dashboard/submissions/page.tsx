'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, TablePagination, Alert, CircularProgress, Chip, IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AppLayout from '@/components/layout/app-layout';
import CodingPreloader from '@/components/ui/coding-preloader';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';

export default function SubmissionsActivityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        // Page is 0-indexed in MUI, 1-indexed in API
        const response = await apiFetch(`/submissions?page=${page + 1}&limit=${rowsPerPage}`, { requireAuth: true });
        if (response.success && response.data) {
          setSubmissions(response.data);
          setTotal(response.meta?.total || 0);
        } else {
          setError(response.message || 'Failed to fetch submissions');
        }
      } catch (err: any) {
        setError(err.message || 'Error connecting to server');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchSubmissions();
    }
  }, [user, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (authLoading || !user) {
    return <CodingPreloader />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted': return 'success';
      case 'Wrong Answer': return 'error';
      case 'Time Limit Exceeded': return 'warning';
      case 'Runtime Error': return 'error';
      case 'Compilation Error': return 'warning';
      default: return 'default';
    }
  };

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => router.push('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>All Submissions Activity</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        
        <Paper sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                <TableRow>
                  <TableCell>Time Submitted</TableCell>
                  <TableCell>Problem</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Runtime</TableCell>
                  <TableCell>Memory</TableCell>
                  <TableCell>Language</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : submissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography variant="body2" color="text.secondary">No submissions found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((sub, i) => (
                    <TableRow key={sub.id || i} hover sx={{ cursor: sub.problem?.id ? 'pointer' : 'default' }} onClick={() => sub.problem?.id && router.push(`/problems/${sub.problem.id}`)}>
                      <TableCell>
                        <Typography variant="body2">{new Date(sub.createdAt).toLocaleDateString()}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {sub.problem?.title || 'Unknown Problem'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={sub.status} 
                          size="small" 
                          color={getStatusColor(sub.status) as any}
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        {sub.status === 'Accepted' ? `${sub.executionTime} ms` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {sub.status === 'Accepted' ? `${sub.memoryUsed} MB` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip label={sub.language} size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </AppLayout>
  );
}
