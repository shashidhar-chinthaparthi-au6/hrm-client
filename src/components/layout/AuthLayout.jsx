import React from 'react';
import PropTypes from 'prop-types';
import { Link, Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, Divider } from '@mui/material';
// import './AuthLayout.css';

const AuthLayout = ({
  backgroundImage,
  logo,
  appName = 'HR Management',
  showAppInfo = true,
  appVersion = '1.0.0',
  companyName = 'Your Company',
  footerLinks = [],
  className = '',
}) => {
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(120deg, #e0f7fa, #bbdefb)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        p: 2
      }}
      className={className}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              mb: 4
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              {logo ? (
                <Box 
                  component="img" 
                  src={logo} 
                  alt={`${appName} logo`}
                  sx={{ height: 40, mr: 2 }}
                />
              ) : (
                <Box 
                  sx={{ 
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}
                >
                  {appName.charAt(0)}
                </Box>
              )}
              <Typography variant="h5" component="h1" color="primary.main">
                {appName}
              </Typography>
            </Link>
          </Box>
          
          <Box sx={{ width: '100%' }}>
            <Outlet />
          </Box>
        </Paper>
        
        {showAppInfo && (
          <Box sx={{ mt: 3, textAlign: 'center', color: 'rgba(0,0,0,0.6)' }}>
            <Typography variant="body2">Version {appVersion}</Typography>
            <Typography variant="body2">&copy; {new Date().getFullYear()} {companyName}</Typography>
          </Box>
        )}
        
        {footerLinks.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            {footerLinks.map((link, index) => (
              <React.Fragment key={`link-${index}`}>
                <Link 
                  to={link.to} 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '0.875rem'
                  }}
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

AuthLayout.propTypes = {
  backgroundImage: PropTypes.string,
  logo: PropTypes.string,
  appName: PropTypes.string,
  showAppInfo: PropTypes.bool,
  appVersion: PropTypes.string,
  companyName: PropTypes.string,
  footerLinks: PropTypes.array,
  className: PropTypes.string
};

export default AuthLayout;