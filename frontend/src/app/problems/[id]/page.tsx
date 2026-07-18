'use client';

import * as React from 'react';
import { 
  Box, Typography, Grid, Paper, Tabs, Tab, Button, Chip, 
  Select, MenuItem, IconButton, CircularProgress, Alert
} from '@mui/material';
import { 
  ThumbUp as ThumbUpIcon, 
  BookmarkBorder as BookmarkIcon, 
  Share as ShareIcon,
  PlayArrow as RunIcon,
  CheckCircle as SubmitIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  Restore as HistoryIcon
} from '@mui/icons-material';
import AppLayout from '@/components/layout/app-layout';
import Editor from '@monaco-editor/react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';
import CodingPreloader from '@/components/ui/coding-preloader';
import { useAuth } from '@/context/auth-context';

const DEFAULT_CODE: Record<string, string> = {
  javascript: `const fs = require('fs');

function solve() {
  const input = fs.readFileSync(0, 'utf-8').trim();
  // Write your code here
  
}
solve();`,
  python: `import sys

def solve():
    input_data = sys.stdin.read().strip()
    # Write your code here
    
solve()`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int input;
    if (cin >> input) {
        // Write your code here
        
    }
    return 0;
}`
};

export default function ProblemSolvingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuth();
  
  const [problem, setProblem] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const [tab, setTab] = React.useState(0);
  const [testcaseTab, setTestcaseTab] = React.useState(0);
  const [language, setLanguage] = React.useState('javascript');
  const [editorTheme, setEditorTheme] = React.useState('vs-dark');
  const [code, setCode] = React.useState('');
  
  const [submitting, setSubmitting] = React.useState(false);
  const [submissionResult, setSubmissionResult] = React.useState<any>(null);

  const [submissions, setSubmissions] = React.useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = React.useState(false);

  const [timerSeconds, setTimerSeconds] = React.useState(0);

  React.useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      setTimerSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, id]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await apiFetch(`/problems/${id}`);
        if (res.success && res.data) {
          setProblem(res.data);
          setCode(`// Write your solution for ${res.data.title}\n\n${DEFAULT_CODE['javascript']}`);
        } else {
          setError('Problem not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProblem();
  }, [id]);

  React.useEffect(() => {
    if (tab === 2 && user && problem) {
      const fetchSubmissions = async () => {
        setLoadingSubmissions(true);
        try {
          const res = await apiFetch(`/submissions?problemId=${problem.id}`, { requireAuth: true });
          if (res.success) {
            setSubmissions(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch submissions', err);
        } finally {
          setLoadingSubmissions(false);
        }
      };
      fetchSubmissions();
    }
  }, [tab, user, problem]);

  const handleSubmit = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setSubmitting(true);
    setSubmissionResult(null);
    setTestcaseTab(2); // Switch to Submission Result / Output tab
    
    try {
      const res = await apiFetch('/submissions', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({
          problemId: problem.id,
          language,
          code,
          timeTaken: timerSeconds
        })
      });
      
      if (res.success) {
        setSubmissionResult(res.data);
      }
    } catch (err: any) {
      setSubmissionResult({ status: 'Error', error: err.message });
    } finally {
      setSubmitting(false);
    }
  };


  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'success.main';
      case 'medium': return 'warning.main';
      case 'hard': return 'error.main';
      default: return 'text.primary';
    }
  };

  if (loading) {
    return <AppLayout><CodingPreloader /></AppLayout>;
  }

  if (error || !problem) {
    return <AppLayout><Box sx={{ p: 4 }}><Alert severity="error">{error || 'Problem not found'}</Alert></Box></AppLayout>;
  }

  return (
    <AppLayout>
      <Box sx={{ flexGrow: 1, height: 'calc(100vh - 72px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 1 }}>
        
        {/* Breadcrumb / Top Info */}
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">Problems</Typography>
            <Typography variant="caption" color="text.secondary">&gt;</Typography>
            <Typography variant="caption" sx={{ color: getDifficultyColor(problem.difficulty) }}>{problem.difficulty}</Typography>
            <Typography variant="caption" color="text.secondary">&gt;</Typography>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{problem.title}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.05)', px: 1.5, py: 0.5, borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Time:</Typography>
            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold', minWidth: 45, textAlign: 'center' }}>
              {formatTime(timerSeconds)}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={1} sx={{ height: '100%', minHeight: 0 }}>
          
          {/* LEFT PANE: Description */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5, px: 2, fontSize: '0.85rem' } }}>
                <Tab label="Description" sx={{ textTransform: 'none', fontWeight: 'bold' }} />
                <Tab label="Editorial" sx={{ textTransform: 'none' }} />
                <Tab label="Submissions" sx={{ textTransform: 'none' }} />
                <Tab label="Discuss" sx={{ textTransform: 'none' }} />
              </Tabs>

              {tab === 0 && (
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{problem.title}</Typography>
                    <Chip label={problem.difficulty} size="small" sx={{ bgcolor: getDifficultyColor(problem.difficulty), color: 'white', fontWeight: 'bold', height: 20, fontSize: '0.7rem' }} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                      <ThumbUpIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Like</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                      <BookmarkIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Add to List</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                      <ShareIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">Share</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    whiteSpace: 'pre-wrap', 
                    typography: 'body2', 
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    '& pre': { bgcolor: 'rgba(255,255,255,0.05)', p: 1.5, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.8rem', mt: 1, mb: 1 }
                  }}>
                    {problem.description}
                  </Box>
                </Box>
              )}

              {tab === 1 && (
                <Box sx={{ flex: 1, overflowY: 'auto', p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Editorial Not Available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                    Check back later for an in-depth explanation and optimal solutions for this problem.
                  </Typography>
                </Box>
              )}

              {tab === 2 && (
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                  {loadingSubmissions ? (
                    <CircularProgress sx={{ display: 'block', m: 'auto', mt: 4 }} size={30} />
                  ) : !user ? (
                    <Alert severity="info" sx={{ mt: 2 }}>Please log in to view your submissions.</Alert>
                  ) : submissions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                      You have not submitted any solutions for this problem yet.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {submissions.map((sub, i) => (
                        <Paper key={i} sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.02)', border: 1, borderColor: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="subtitle2" color={sub.status === 'Accepted' ? 'success.main' : 'error.main'}>
                              {sub.status}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(sub.createdAt).toLocaleString()} • {sub.language}
                            </Typography>
                          </Box>
                          {sub.status === 'Accepted' && (
                            <Box sx={{ display: 'flex', gap: 2, textAlign: 'right' }}>
                              {sub.score !== undefined && (
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Score</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{sub.score}</Typography>
                                </Box>
                              )}
                              <Box>
                                <Typography variant="caption" color="text.secondary">Runtime</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sub.executionTime} ms</Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">Memory</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{sub.memoryUsed} MB</Typography>
                              </Box>
                            </Box>
                          )}
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Box>
              )}

              {tab === 3 && (
                <Box sx={{ flex: 1, overflowY: 'auto', p: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Discussions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                    Join the community to discuss approaches and ask questions. (Feature coming soon)
                  </Typography>
                </Box>
              )}

              <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  color="inherit" 
                  disabled={!problem.prevId}
                  onClick={() => router.push(`/problems/${problem.prevId}`)}
                >
                  Previous
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  color="primary" 
                  disabled={!problem.nextId}
                  onClick={() => router.push(`/problems/${problem.nextId}`)}
                >
                  Next
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT PANE: IDE & Console */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
            
            {/* EDITOR */}
            <Paper sx={{ flex: 2, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', bgcolor: '#1e1e1e' }}>
              <Box sx={{ p: 0.5, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Select 
                    size="small" 
                    value={language} 
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      if (problem) {
                        setCode(`// Write your solution for ${problem.title}\n\n${DEFAULT_CODE[e.target.value]}`);
                      }
                    }}
                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, bgcolor: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', height: 28 }}
                  >
                    <MenuItem value="javascript" sx={{ fontSize: '0.85rem' }}>JavaScript (Node.js)</MenuItem>
                    <MenuItem value="python" sx={{ fontSize: '0.85rem' }}>Python 3</MenuItem>
                    <MenuItem value="cpp" sx={{ fontSize: '0.85rem' }}>C++ 20</MenuItem>
                  </Select>
                  <Select 
                    size="small" 
                    value={editorTheme} 
                    onChange={(e) => setEditorTheme(e.target.value)}
                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, bgcolor: 'rgba(255,255,255,0.05)', fontSize: '0.8rem', height: 28 }}
                  >
                    <MenuItem value="vs-dark" sx={{ fontSize: '0.85rem' }}>VS Dark</MenuItem>
                    <MenuItem value="light" sx={{ fontSize: '0.85rem' }}>Light</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}><FullscreenIcon sx={{ fontSize: 18 }} /></IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary' }}><SettingsIcon sx={{ fontSize: 18 }} /></IconButton>
                </Box>
              </Box>

              <Box sx={{ flex: 1, minHeight: 0 }}>
                <Editor
                  height="100%"
                  language={language}
                  theme={editorTheme}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  loading={<CircularProgress sx={{ display: 'block', m: 'auto', mt: 5 }} />}
                  options={{ minimap: { enabled: false }, fontSize: 13, lineHeight: 22, padding: { top: 12 } }}
                />
              </Box>

              <Box sx={{ p: 1, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 1, borderColor: 'rgba(255,255,255,0.1)', bgcolor: 'background.paper' }}>
                <Typography variant="caption" color={submissionResult?.status === 'Accepted' ? 'success.main' : 'text.secondary'} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {submissionResult?.status === 'Accepted' && <SubmitIcon sx={{ fontSize: 16 }} />} 
                  {submissionResult ? submissionResult.status : 'Ready'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" color="inherit" size="small" onClick={handleSubmit} disabled={submitting} startIcon={<RunIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: '0.8rem', py: 0 }}>Run Code</Button>
                  <Button variant="contained" color="primary" size="small" onClick={handleSubmit} disabled={submitting} startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SubmitIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: '0.8rem', py: 0 }}>
                    Submit Code
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* TESTCASES / CONSOLE */}
            <Paper sx={{ flex: 1.2, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
              <Tabs value={testcaseTab} onChange={(_, v) => setTestcaseTab(v)} sx={{ minHeight: 32, borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { minHeight: 32, py: 0.5, fontSize: '0.8rem' } }}>
                <Tab label="Testcase" sx={{ textTransform: 'none' }} />
                <Tab label="Custom Input" sx={{ textTransform: 'none' }} />
                <Tab label="Submission Result" sx={{ textTransform: 'none' }} />
              </Tabs>
              
              <Box sx={{ flex: 1, p: 1.5, overflowY: 'auto' }}>
                {testcaseTab === 0 && problem.testCases && problem.testCases.map((tc: any, i: number) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>Test Case {i + 1}</Typography>
                    <Typography variant="caption" color="text.secondary">Input:</Typography>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, mb: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {tc.input}
                    </Box>
                    <Typography variant="caption" color="text.secondary">Expected Output:</Typography>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {tc.output}
                    </Box>
                  </Box>
                ))}
                
                {testcaseTab === 0 && (!problem.testCases || problem.testCases.length === 0) && (
                  <Typography variant="body2" color="text.secondary">No public testcases available.</Typography>
                )}

                {testcaseTab === 1 && (
                  <Typography variant="body2" color="text.secondary">Custom input is not supported for this language yet.</Typography>
                )}

                {testcaseTab === 2 && (
                  <Box>
                    {submitting ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2">Evaluating your solution on hidden testcases...</Typography>
                      </Box>
                    ) : submissionResult ? (
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', mb: 2,
                          color: submissionResult.status === 'Accepted' ? 'success.main' : 'error.main' 
                        }}>
                          {submissionResult.status}
                        </Typography>
                        
                        {submissionResult.error && (
                          <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: 'error.light', borderRadius: 1, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                            {submissionResult.error}
                          </Box>
                        )}
                        
                        {submissionResult.status === 'Accepted' && (
                          <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                            {submissionResult.score !== undefined && (
                              <Box>
                                <Typography variant="caption" color="text.secondary">Score</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{submissionResult.score}</Typography>
                              </Box>
                            )}
                            <Box>
                              <Typography variant="caption" color="text.secondary">Testcases</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{submissionResult.passedCases} / {submissionResult.totalCases}</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Runtime</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{submissionResult.executionTime} ms</Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" color="text.secondary">Memory</Typography>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{submissionResult.memoryUsed} MB</Typography>
                            </Box>
                          </Box>
                        )}

                        {submissionResult.status !== 'Accepted' && submissionResult.totalCases !== undefined && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="error.main">
                              Passed {submissionResult.passedCases} out of {submissionResult.totalCases} testcases.
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Submit your code to see the evaluation results against all testcases here.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>

          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}
