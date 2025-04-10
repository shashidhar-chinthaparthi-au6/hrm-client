import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Fade,
  Zoom
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { resetPassword } from '../../redux/actions/authActions';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(resetPassword({ token, newPassword: values.password })).unwrap();
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error('Failed to reset password:', err);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              component="button"
              onClick={() => navigate('/login')}
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
              Enter your new password below
            </Typography>

            {success ? (
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
                    Password Reset Successful!
                  </Typography>
                  <Typography sx={{ mb: 3 }}>
                    Your password has been reset successfully. You will be redirected to the login page shortly.
                  </Typography>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ 
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'primary.light',
                        color: 'primary.dark',
                      }
                    }}
                  >
                    Go to Login
                  </Button>
                </Box>
              </Zoom>
            ) : (
              <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
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
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
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
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
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
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Reset Password'
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

export default ResetPassword; 