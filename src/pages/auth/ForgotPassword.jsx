import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  Fade,
  Zoom
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const validateEmail = (email) => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Replace with actual API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        py: 4,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={500}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)',
              }
            }}
          >
            <Button
              component={Link}
              to="/login"
              startIcon={<ArrowBackIcon />}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              Back to Login
            </Button>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 1,
                fontWeight: 700,
                color: 'primary.main',
                textAlign: 'center'
              }}
            >
              Reset Your Password
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 4,
                color: 'text.secondary',
                textAlign: 'center'
              }}
            >
              Enter your email to receive a password reset link
            </Typography>

            {isSubmitted ? (
              <Zoom in timeout={500}>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      backgroundColor: 'success.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: 48,
                        color: 'success.main'
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Check Your Email
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    We've sent a password reset link to <strong>{email}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    If you don't see the email, check your spam folder or{' '}
                    <MuiLink
                      component="button"
                      variant="body2"
                      onClick={handleSubmit}
                      sx={{ 
                        fontWeight: 600,
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark',
                        }
                      }}
                    >
                      click here to resend
                    </MuiLink>
                  </Typography>
                  <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      mt: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.light',
                        color: 'primary.dark',
                      }
                    }}
                  >
                    Return to login
                  </Button>
                </Box>
              </Zoom>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 24
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  error={Boolean(error)}
                  fullWidth
                  required
                  disabled={isSubmitting}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      opacity: 0.7
                    }
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForgotPassword;