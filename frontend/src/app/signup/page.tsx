'use client';

import * as React from 'react';
import { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { UI_STRINGS } from '@/constants/ui-strings';
import NavBar from '@/components/nav-bar';
import { apiFetch } from '@/utils/api';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });

      if (response.success && response.data) {
        login(response.data.tokens.accessToken, {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role,
        });
        router.push('/dashboard');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pt: { xs: 12, md: 0 } }}>
        <Container maxWidth="sm">
          <Box sx={{ 
            p: 4, 
            bgcolor: 'background.paper', 
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 700 }}>
              {UI_STRINGS.AUTH_SIGNUP_TITLE}
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
              {UI_STRINGS.AUTH_SIGNUP_SUBTITLE}
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={UI_STRINGS.AUTH_USERNAME_LABEL}
                type="text"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={UI_STRINGS.AUTH_EMAIL_LABEL}
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label={UI_STRINGS.AUTH_PASSWORD_LABEL}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 4, mb: 2 }}
              >
                {loading ? '...' : UI_STRINGS.AUTH_SUBMIT_SIGNUP}
              </Button>
              
              <Typography align="center" variant="body2">
                <Link href="/login" style={{ color: '#7c4dff' }}>
                  {UI_STRINGS.AUTH_HAS_ACCOUNT}
                </Link>
              </Typography>
            </form>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
