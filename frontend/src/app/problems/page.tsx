'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { 
  Box, Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, CircularProgress, 
  Alert, TextField, Select, MenuItem, InputLabel, FormControl, 
  Pagination, Grid
} from '@mui/material';
import { UI_STRINGS } from '@/constants/ui-strings';
import NavBar from '@/components/nav-bar';
import { apiFetch } from '@/utils/api';
import { useDebounce } from '@/hooks/use-debounce';
import { useQueryParams } from '@/hooks/use-query-params';
import CodingPreloader from '@/components/ui/coding-preloader';
import { useRouter } from 'next/navigation';

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function ProblemsContent() {
  const { setParam, searchParams, getQueryString } = useQueryParams();
  const router = useRouter();
  
  const [problems, setProblems] = useState<Problem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local state for search so we don't block the UI while typing
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  
  // The throttled value that actually triggers the API fetch
  const debouncedSearch = useDebounce(searchValue, 500);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== (searchParams.get('search') || '')) {
      setParam('search', debouncedSearch || null);
    }
  }, [debouncedSearch, searchParams, setParam]);

  // Fetch problems whenever the URL parameters change
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const queryStr = getQueryString();
        const response = await apiFetch(`/problems${queryStr ? `?${queryStr}` : ''}`);
        if (response.success && response.data) {
          setProblems(response.data);
          setMeta(response.meta);
        } else {
          setError('Failed to fetch problems');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching problems');
      } finally {
        setLoading(false);
      }
    };
    
    // We only fetch if the debouncedSearch matches the URL search
    // This prevents double-fetching while the URL is still updating
    if (debouncedSearch === (searchParams.get('search') || '')) {
      fetchProblems();
    }
  }, [getQueryString, debouncedSearch, searchParams]);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
        {UI_STRINGS.PROBLEMS_TITLE}
      </Typography>

      <Box sx={{ mb: 4, mt: 4 }}>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Search Problems..."
              variant="outlined"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={searchParams.get('difficulty') || ''}
                label="Difficulty"
                onChange={(e) => setParam('difficulty', e.target.value || null)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={searchParams.get('sort') || '-createdAt'}
                label="Sort By"
                onChange={(e) => setParam('sort', e.target.value)}
              >
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="createdAt">Oldest First</MenuItem>
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="-title">Title (Z-A)</MenuItem>
                <MenuItem value="difficulty">Difficulty</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <CodingPreloader />
      ) : (
        <>
          {meta && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
                </Typography>
                <FormControl size="small">
                  <Select
                    value={searchParams.get('limit') || '10'}
                    onChange={(e) => setParam('limit', e.target.value)}
                    sx={{ height: 32 }}
                  >
                    <MenuItem value="10">10 per page</MenuItem>
                    <MenuItem value="20">20 per page</MenuItem>
                    <MenuItem value="50">50 per page</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {meta.totalPages > 0 && (
                <Pagination 
                  count={meta.totalPages} 
                  page={meta.page} 
                  siblingCount={3}
                  boundaryCount={1}
                  showFirstButton
                  showLastButton
                  onChange={(e, val) => setParam('page', val.toString())}
                  color="primary" 
                />
              )}
            </Box>
          )}
          
          <TableContainer component={Paper} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Title</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>{UI_STRINGS.PROBLEMS_DIFFICULTY}</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {problems.map((problem) => (
                  <TableRow 
                    key={problem.id} 
                    hover 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/problems/${problem.id}`)}
                  >
                    <TableCell>{problem.title}</TableCell>
                    <TableCell>{problem.category || 'Algorithms'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={problem.difficulty.toUpperCase()} 
                        color={getDifficultyColor(problem.difficulty)} 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {problems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No problems found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </>
      )}
    </Container>
  );
}

import AppLayout from '@/components/layout/app-layout';

export default function ProblemsPage() {
  return (
    <AppLayout>
      <Suspense fallback={<CircularProgress />}>
        <ProblemsContent />
      </Suspense>
    </AppLayout>
  );
}
